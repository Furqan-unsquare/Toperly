import express from "express";
import { createOrder, verifyPayment, getPaymentDetails } from "../controllers/paymentController.js";
import { verifyAuth0Token } from '../middlewares/auth.middleware.js'; // Modified name

const router = express.Router();


// Routes
router.post("/create-order", createOrder);
router.post("/verify", verifyAuth0Token, verifyPayment);
router.get("/:paymentId", getPaymentDetails);

export default router;