import Razorpay from "razorpay";
import crypto from "crypto";
import axios from "axios";
import mongoose from "mongoose";
import EnrolledCourse from "../models/EnrolledCourse.js";
import Course from "../models/Course.js";
import Student from "../models/Student.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order
export const createOrder = async (req, res) => {
  try {
    let { amount, currency = "INR", courseId, courseName, userEmail } = req.body;

    if (!amount || !courseId || !courseName || !userEmail) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: amount, courseId, courseName, userEmail",
      });
    }

    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: "Invalid courseId" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Convert to smallest currency unit (paise for INR)
    amount = parseInt(amount) / 100;

    const generateSafeReceipt = (courseId) => {
      const timestamp = Date.now().toString(36);
      const courseShort = courseId.slice(-6);
      return `c_${courseShort}_${timestamp}`.substring(0, 40);
    };

    const receipt = generateSafeReceipt(courseId);

    const options = {
      amount, // now in paise
      currency,
      receipt,
      notes: { courseId, courseName, userEmail, originalCourseId: courseId },
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount, // will return 249900 for ₹2499
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        created_at: order.created_at,
      },
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// Verify payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courseId) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: razorpay_order_id, razorpay_payment_id, razorpay_signature, or courseId",
      });
    }

    // Check if req.auth is available
    if (!req.auth || !req.auth.sub) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No valid Auth0 token provided",
      });
    }

    const auth0Id = req.auth.sub;

    // Log for debugging
    console.log("Verifying payment for:", { auth0Id, courseId, razorpay_payment_id });

    // Find the student by auth0Id
    const student = await Student.findOne({ auth0Id });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: "Invalid courseId" });
    }

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // Fetch payment details from Razorpay
    const paymentResponse = await axios.get(
      `https://api.razorpay.com/v1/payments/${razorpay_payment_id}`,
      {
        auth: {
          username: process.env.RAZORPAY_KEY_ID,
          password: process.env.RAZORPAY_KEY_SECRET,
        },
      }
    );

    const { amount, currency, method, bank, wallet, vpa, card } = paymentResponse.data;

    // Log payment details
    if (method === "upi") {
      console.log("UPI Payment Details:", { method, vpa });
    } else {
      console.log("Payment Method:", method);
    }

    // Check for existing enrollment
    const existingEnrollment = await EnrolledCourse.findOne({
      student: student._id,
      course: courseId,
    });

    if (!existingEnrollment) {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        await EnrolledCourse.create(
          [
            {
              student: student._id,
              course: courseId,
              paymentDetails: {
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                signature: razorpay_signature,
                amount,
                currency,
                method,
                bank,
                wallet,
                vpa,
                card,
                status: "completed",
              },
            },
          ],
          { session }
        );

        await Course.findByIdAndUpdate(
          courseId,
          { $addToSet: { enrolledStudents: student._id } },
          { session }
        );

        await session.commitTransaction();
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    } else {
      return res.status(409).json({
        success: false,
        message: "Student is already enrolled in this course",
      });
    }

    res.json({
      success: true,
      message: "Payment verified and enrollment completed",
      paymentMethod: method,
      bank,
      wallet,
      vpa,
      card,
    });
  } catch (error) {
    console.error("Error verifying payment:", { error: error.message, auth0Id: req.auth?.sub, courseId });
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

// Get payment details
export const getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await razorpay.payments.fetch(paymentId);

    res.json({
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        order_id: payment.order_id,
        method: payment.method,
        bank: payment.bank,
        wallet: payment.wallet,
        vpa: payment.vpa,
        card: payment.card,
        created_at: payment.created_at,
        notes: payment.notes,
      },
    });
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment details",
      error: error.message,
    });
  }
};