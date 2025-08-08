import axios from "axios";
import { PaymentResponse } from "../types/payment";

const API_BASE_URL = "http://192.168.1.29:5000/api";

export const paymentService = {
  createOrder: async (orderData: {
    amount: number;
    courseId: string;
    courseName: string;
    userEmail: string;
    currency?: string;
  }): Promise<PaymentResponse> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/payment/create-order`,
        orderData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to create payment order"
      );
    }
  },

  verifyPayment: async (verificationData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    courseId: string;
    userEmail: string;
    userId: string;
  }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/payment/verify`,
        verificationData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Payment verification failed"
      );
    }
  },

  getPaymentDetails: async (paymentId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/payment/${paymentId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch payment details"
      );
    }
  },
};
