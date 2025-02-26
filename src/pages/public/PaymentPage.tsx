import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import axios from "axios";

interface PaymentPageProps {
  selectedSeats: string[];
  movieId: string;
  theatreId: string;
  slot: string;
  date: string;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ selectedSeats, movieId, theatreId, slot, date }) => {
  const [totalAmount, setTotalAmount] = useState(0);
  // const navigate = useNavigate();

  useEffect(() => {
    setTotalAmount(selectedSeats.length * 150);
  }, [selectedSeats]);

  const handlePayment = async () => {
    try {
      const response = await axios.post("http://localhost:4001/api/payments/create-session", {
        selectedSeats,
        movieId,
        theatreId,
        slot,
        date,
        totalAmount
      });

      window.location.href = response.data.url; // Redirect to Stripe
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Confirm Payment</h2>
      <p className="text-lg">Total Seats: {selectedSeats.length}</p>
      <p className="text-lg font-semibold">Total Amount: ₹{totalAmount}</p>
      <button
        className="bg-blue-500 text-white px-6 py-3 rounded-lg mt-4 hover:bg-blue-600"
        onClick={handlePayment}
      >
        Pay Now
      </button>
    </div>
  );
};

export default PaymentPage;
