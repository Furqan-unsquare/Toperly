import { useState } from 'react';
import { paymentService } from '../services/paymentService';
import { Course, RazorpayOptions, RazorpayPaymentResponse } from '../types/payment';
import { useAuth } from '@/contexts/AuthContext';

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { user } = useAuth();

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiatePayment = async (
    course: Course,
    userDetails: { name: string; email: string; contact: string }
  ) => {
    try {
      setLoading(true);
      setError(null);
      setPaymentSuccess(false);

      // Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Failed to load Razorpay script');
      }

      // Create order
      const orderResponse = await paymentService.createOrder({
        amount: course.price,
        courseId: course.id,
        courseName: course.name,
        userEmail: userDetails.email,
      });

      if (!orderResponse.success || !orderResponse.order) {
        throw new Error(orderResponse.message || 'Failed to create order');
      }

      // Razorpay options
      const options: RazorpayOptions = {
        key: orderResponse.key_id!,
        amount: orderResponse.order.amount,
        currency: orderResponse.order.currency,
        name: 'Course Academy',
        description: `Purchase ${course.name}`,
        order_id: orderResponse.order.id,
        handler: async (response: RazorpayPaymentResponse) => {
          try {
            // Verify payment
            const verificationResponse = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: course.id,
              userEmail: userDetails.email,
              userId:user._id
            });

            if (verificationResponse.success) {
              setPaymentSuccess(true);
              // You can add success callback here
              console.log('Payment successful!', verificationResponse);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (err: any) {
            setError(err.message);
            console.error('Payment verification error:', err);
          }
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.contact,
        },
        theme: {
          color: '#3B82F6',
        },
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on('payment.failed', (response: any) => {
        setError(`Payment failed: ${response.error.description}`);
        console.error('Payment failed:', response.error);
      });

    } catch (err: any) {
      setError(err.message);
      console.error('Payment initiation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetPaymentState = () => {
    setError(null);
    setPaymentSuccess(false);
    setLoading(false);
  };

  return {
    loading,
    error,
    paymentSuccess,
    initiatePayment,
    resetPaymentState,
  };
};
