import express, { urlencoded } from "express";
import dotenv from "dotenv";
import { urlRouter } from "./routes/url.routes.js";
import { connectDB } from "./db/db.js";
import { globalErrorHandler } from "./utils/globalErrorhandler.js";
import authRoutes from "./routes/authRoutes.js";
import instructorRoutes from "./routes/instructorRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import enrollRoutes from "./routes/enrollRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import quizAttemptRoutes from "./routes/quizAttemptRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import userAdminRoutes from "./routes/userAdminRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import https from "https";
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { uploadBufferToIPFS } from "./utils/uploadToIPFS.js";
import { verifyToken } from "./middlewares/auth.middleware.js";
import Student from "./models/Student.js";
import Instructor from "./models/Instructor.js";
import EnrolledCourse from "./models/EnrolledCourse.js";
import Certificate from "./models/Certificate.js";
import Quiz from "./models/Quiz.js";
import Review from "./models/Review.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import Course from "./models/Course.js";
// Load environment variables
dotenv.config({ path: "./.env" });

// Validate critical environment variables
const requiredEnvVars = [
  "MONGO_URI",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error(`Missing environment variables: ${missingEnvVars.join(", ")}`);
  process.exit(1);
}

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/temp", express.static(path.join(__dirname, "public/temp")));
const allowedOrigins = [
  "ttp://localhost:8080",
  "ttp://localhost:8081",
  "https://toperly-unsquare.netlify.app",
  "https://toperly-dashboard-unsquare.netlify.app",
];

app.use(
  cors("*")
);

// Middleware
app.use(express.json({ limit: "20mb" }));
app.use(urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());
app.use(express.static("public"));

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.get("/", (req, res) => {
  res.json({ message: "Razorpay Payment Server is running!" });
});

// Create order endpoint
app.post("/api/payment/create-order", async (req, res) => {
  try {
    const {
      amount,
      currency = "INR",
      courseId,
      courseName,
      userEmail,
    } = req.body;

    if (!amount || !courseId || !courseName || !userEmail) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: amount, courseId, courseName, userEmail",
      });
    }

    // Safe receipt generation - guaranteed under 40 chars
    const generateSafeReceipt = (courseId) => {
      const timestamp = Date.now().toString(36); // Base36 for shorter string
      const courseShort = courseId.slice(-6); // Last 6 chars of courseId
      return `c_${courseShort}_${timestamp}`.substring(0, 40); // Ensure max 40 chars
    };

    const receipt = generateSafeReceipt(courseId);

    const options = {
      amount: amount,
      currency: currency,
      receipt: receipt,
      notes: {
        courseId: courseId,
        courseName: courseName,
        userEmail: userEmail,
        originalCourseId: courseId, // Full courseId for reference
      },
    };

    console.log(
      "Creating order with receipt:",
      receipt,
      "(length:",
      receipt.length,
      ")"
    );

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
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
});

// Verify payment endpoint
app.post("/api/payment/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      userEmail,
      userId, // Add userId to the verification
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification parameters",
      });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment verified successfully - Now enroll the student
      try {
        // Fetch payment details from Razorpay API
        const paymentResponse = await axios.get(
          `https://api.razorpay.com/v1/payments/${razorpay_payment_id}`,
          {
            auth: {
              username: process.env.RAZORPAY_KEY_ID,
              password: process.env.RAZORPAY_KEY_SECRET,
            },
          }
        );

        // Extract amount and currency
        const amount = paymentResponse.data.amount; // in paise
        const currency = paymentResponse.data.currency;

        // Check if already enrolled
        const existingEnrollment = await EnrolledCourse.findOne({
          student: userId,
          course: courseId,
        });

        if (!existingEnrollment) {
          // Create enrollment
          const enrollment = new EnrolledCourse({
            student: userId,
            course: courseId,
            paymentDetails: {
              paymentId: razorpay_payment_id,
              orderId: razorpay_order_id,
              signature: razorpay_signature,
              amount: amount * 100, // You can get this from the order details
              currency: "INR",
              status: "completed",
            },
          });

          await enrollment.save();

          // Update course enrolled students count
          await Course.findByIdAndUpdate(courseId, {
            $addToSet: { enrolledStudents: userId },
          });
        }

        res.json({
          success: true,
          message: "Payment verified and enrollment completed successfully",
          paymentDetails: {
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            courseId: courseId,
            userEmail: userEmail,
          },
        });
      } catch (enrollmentError) {
        console.error("Enrollment error after payment:", enrollmentError);
        // Payment was successful but enrollment failed
        res.json({
          success: true,
          message:
            "Payment verified successfully. Enrollment will be processed shortly.",
          paymentDetails: {
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            courseId: courseId,
            userEmail: userEmail,
          },
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
});

// Get payment details endpoint
app.get("/api/payment/:paymentId", async (req, res) => {
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
});

// Webhook endpoint for Razorpay events
app.post("/api/webhook/razorpay", (req, res) => {
  try {
    const webhookSignature = req.headers["x-razorpay-signature"];
    const webhookBody = JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(webhookBody)
      .digest("hex");

    if (webhookSignature === expectedSignature) {
      const event = req.body;

      // Handle different webhook events
      switch (event.event) {
        case "payment.captured":
          console.log("Payment captured:", event.payload.payment.entity);
          // Handle successful payment
          break;
        case "payment.failed":
          console.log("Payment failed:", event.payload.payment.entity);
          // Handle failed payment
          break;
        default:
          console.log("Unhandled webhook event:", event.event);
      }

      res.status(200).json({ success: true });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Invalid webhook signature" });
    }
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Middleware to validate AccessKey
const validateAccessKey = (req, res, next) => {
  const accessKey = req.headers["accesskey"];
  if (accessKey !== "91af975e-1e11-49ae-86c54773bb01-70be-4cb3") {
    return res.status(401).json({ error: "Invalid AccessKey" });
  }
  next();
};

// Function to fetch live data from Bunny Storage API
const fetchBunnyStorageData = () => {
  return new Promise((resolve, reject) => {
    const storageZoneName = "unsquare-toperly2"; // Replace with your storage zone name
    const accessKey = "850ff193-b428-41d8-b3d319bc0f3f-abb6-4e95"; // Match with validateAccessKey
    const path = "images"; // Folder path
    const url = `https://storage.bunnycdn.com/${storageZoneName}/${path}/`;

    https
      .get(
        url,
        {
          headers: {
            AccessKey: accessKey,
            accept: "*/*",
          },
        },
        (resp) => {
          let data = "";

          resp.on("data", (chunk) => {
            data += chunk;
          });

          resp.on("end", () => {
            try {
              const parsedData = JSON.parse(data);
              resolve(parsedData);
            } catch (error) {
              reject(new Error(`Parsing error: ${error.message}`));
            }
          });
        }
      )
      .on("error", (error) => {
        reject(new Error(`Request error: ${error.message}`));
      });
  });
};

// GET endpoint
app.get("/unsquare-toperly/images", validateAccessKey, async (req, res) => {
  try {
    const imagesData = await fetchBunnyStorageData();
    res.set("Content-Type", "application/json");
    res.json({ message: "Images retrieved successfully", data: imagesData });
  } catch (error) {
    console.error("Bunny Storage fetch error:", error.message); // Log error for debugging
    res.status(500).json({ error: "Failed to fetch data from Bunny Storage" });
  }
});

// Your actual VdoCipher secret key with Apisecret prefix
const VDOCIPHER_SECRET =
  "Apisecret YQuiazweAkBEiKBbhOewcrZGQXF8daGxz4Onn6KKFvqiGnMlRskklPrRgAfYbLnS";

app.get("/api/vdocipher/otp/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;

    const response = await axios.post(
      `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
      { ttl: 300 },
      {
        headers: {
          Authorization: VDOCIPHER_SECRET,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (err) {
    console.error("OTP generation failed:", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to generate OTP for video" });
  }
});

app.get("/api", verifyToken, async (req, res) => {
  try {
    const students = await Student.find();
    const instructors = await Instructor.find();
    const enrollments = await EnrolledCourse.find();
    const certificates = await Certificate.find();
    const quizzes = await Quiz.find();
    const reviews = await Review.find();

    res.json({
      students,
      instructors,
      enrollments,
      certificates,
      quizzes,
      reviews,
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "error while fetching all the data" });
  }
});

// Routes
app.use("/api/url", urlRouter);
app.use("/api/auth", authRoutes);
app.use("/api/instructors", instructorRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/enroll", enrollRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/quiz-attempts", quizAttemptRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/admin", userAdminRoutes);
app.use("/api/blogs", blogRoutes);

// Error Handler
app.use(globalErrorHandler);

// Handle uncaught exceptions and rejections
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is listening on ttp://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

start();
