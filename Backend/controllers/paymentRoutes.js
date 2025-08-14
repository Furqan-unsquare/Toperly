// routes/paymentRoutes.js
import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import axios from "axios";
import EnrolledCourse from "../models/EnrolledCourse.js";
import Course from "../models/Course.js";

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order
router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", courseId, courseName, userEmail } = req.body;

    if (!amount || !courseId || !courseName || !userEmail) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: amount, courseId, courseName, userEmail",
      });
    }

    const generateSafeReceipt = (courseId) => {
      const timestamp = Date.now().toString(36);
      const courseShort = courseId.slice(-6);
      return `c_${courseShort}_${timestamp}`.substring(0, 40);
    };

    const receipt = generateSafeReceipt(courseId);

    const options = {
      amount: amount,
      currency,
      receipt,
      notes: { courseId, courseName, userEmail, originalCourseId: courseId },
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        created_at: order.created_at,
      },
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Failed to create order", error: error.message });
  }
});

// Verify payment
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId, userEmail, userId } = req.body;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment verification parameters" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // Fetch payment method & details
    const paymentResponse = await axios.get(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
      auth: {
        username: process.env.RAZORPAY_KEY_ID,
        password: process.env.RAZORPAY_KEY_SECRET,
      },
    });

    const { amount, currency, method, bank, wallet, vpa, card } = paymentResponse.data;

    // Log UPI details
if (method === "upi") {
  console.log("UPI Payment Details:", { method, vpa });
} else {
  console.log("Payment Method:", method);
}

    const existingEnrollment = await EnrolledCourse.findOne({ student: userId, course: courseId });

    if (!existingEnrollment) {
      await EnrolledCourse.create({
        student: userId,
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
      });

      await Course.findByIdAndUpdate(courseId, { $addToSet: { enrolledStudents: userId } });
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
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, message: "Payment verification failed", error: error.message });
  }
});

// Get payment details
router.get("/:paymentId", async (req, res) => {
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
    res.status(500).json({ success: false, message: "Failed to fetch payment details", error: error.message });
  }
});

export default router;
