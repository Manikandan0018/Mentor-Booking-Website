// File: src/pages/Payment.jsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // ⚠️ The booking is saved by the Stripe Webhook. We only show success and redirect.

    const timer = setTimeout(() => {
      alert(
        "Payment successful and booking confirmed! You can view your bookings now."
      );
      navigate("/"); // Redirect to home or dashboard
    }, 3000);

    // Cleanup function
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-green-600 mb-4">
        Payment Successful! 🎉
      </h1>
      <p className="text-center mt-2 text-lg text-gray-700">
        Your booking is confirmed and details have been saved.
      </p>
      <p className="text-center text-gray-500 mt-2">
        Redirecting in 3 seconds...
      </p>
    </div>
  );
};

export default Payment;
