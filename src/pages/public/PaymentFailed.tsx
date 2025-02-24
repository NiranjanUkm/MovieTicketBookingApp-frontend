import React from "react";
import { useNavigate } from "react-router-dom";
import failedIcon from "../../assets/payment-failed.png"; // Add a red cross or failed icon

const PaymentFailed: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 text-center p-6">
      {/* Failed Icon */}
      <img src={failedIcon} alt="Payment Failed" className="w-24 h-24 mb-4" />

      {/* Failure Message */}
      <h1 className="text-2xl font-bold text-red-600">Payment Failed</h1>
      <p className="text-gray-700 mt-2">Oops! Something went wrong with your payment.</p>

      {/* Retry & Home Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => navigate("/seat/:movieId/:date/:theater/:slot")}
          className="bg-red-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-red-600"
        >
          Retry Payment
        </button>
        <button
          onClick={() => navigate("/")}
          className="bg-gray-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-gray-600"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentFailed;
