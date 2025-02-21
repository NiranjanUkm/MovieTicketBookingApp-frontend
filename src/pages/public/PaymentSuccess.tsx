import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import axios from "axios";
import { Button, Text, Loader } from "@mantine/core"; // Mantine components

interface TicketDetails {
  movieId: string;
  movie: string;
  theatre: string;
  date: string;
  time: string;
  seats: string[];
  price: number;
}

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ticketRef = useRef<HTMLDivElement>(null);
  const [bookingStatus, setBookingStatus] = useState<string | null>(null); // loading, success, error
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Specific error message

  console.log("PaymentSuccess component mounted");

  const ticketDetails: TicketDetails = location.state || {
    movieId: "tt1375666",
    movie: "Oppenheimer",
    theatre: "PVR Cinemas",
    date: "20 Feb 2025",
    time: "07:30 PM",
    seats: ["A1", "A2", "A3"],
    price: 150 * 3,
  };

  const bookTicket = async () => {
    console.log("bookTicket function called");
    console.log("Token:", localStorage.getItem("token"));
    console.log("Request payload:", {
      movieId: ticketDetails.movieId,
      title: ticketDetails.movie,
      poster: `/images/${ticketDetails.movieId}.jpg`,
      seats: ticketDetails.seats,
    });

    setBookingStatus("loading");
    setErrorMessage(null); // Reset error message

    try {
      const response = await axios.post(
        "http://localhost:4001/api/orders/createOrder",
        {
          movieId: ticketDetails.movieId,
          title: ticketDetails.movie,
          poster: `/images/${ticketDetails.movieId}.jpg`,
          seats: ticketDetails.seats,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      console.log("🎟 Ticket booked successfully:", response.data);
      setBookingStatus("success");
    } catch (error: any) {
      console.error("Error booking ticket:", error.response?.data || error.message);
      setBookingStatus("error");
      setErrorMessage(error.response?.data?.message || "An error occurred while booking.");
    }
  };

  useEffect(() => {
    console.log("useEffect triggered");
    bookTicket();
  }, []);

  const handleDownloadPDF = () => {
    if (!ticketRef.current) return;

    toPng(ticketRef.current, { quality: 0.95 })
      .then((imgData) => {
        const pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 10, 10, 180, 100);
        pdf.save(`ticket-${ticketDetails.movie}.pdf`);
      })
      .catch((error) => {
        console.error("PDF Generation Error:", error);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Text size="xl" fw={700} c="green" mb="lg">
        🎉 Payment Successful! 🎉
      </Text>

      {/* Status Feedback */}
      {bookingStatus === "loading" && (
        <div className="flex items-center gap-2 mb-4">
          <Loader size="sm" color="gray" />
          <Text c="gray">Booking your ticket...</Text>
        </div>
      )}
      {bookingStatus === "success" && (
        <Text c="green" mb="lg">
          Ticket booked successfully!
        </Text>
      )}
      {bookingStatus === "error" && (
        <Text c="red" mb="lg">
          {errorMessage}
        </Text>
      )}

      {/* Ticket Design */}
      <div
        ref={ticketRef}
        className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 w-96 relative"
      >
        <div className="border-b pb-2 mb-2">
          <Text fw={600} size="lg" c="gray.8">
            {ticketDetails.movie}
          </Text>
          <Text size="sm" c="gray.5">
            {ticketDetails.theatre}
          </Text>
        </div>
        <div className="text-sm text-gray-700">
          <Text size="sm">
            <strong>Date:</strong> {ticketDetails.date}
          </Text>
          <Text size="sm">
            <strong>Time:</strong> {ticketDetails.time}
          </Text>
          <Text size="sm">
            <strong>Seats:</strong> {ticketDetails.seats.join(", ")}
          </Text>
          <Text size="sm">
            <strong>Total Price:</strong> ₹{ticketDetails.price}
          </Text>
        </div>
        <div className="absolute top-1/2 -right-5 w-10 h-10 bg-gray-100 border border-gray-300 rounded-full"></div>
        <div className="absolute top-1/2 -left-5 w-10 h-10 bg-gray-100 border border-gray-300 rounded-full"></div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4">
        <Button onClick={handleDownloadPDF} color="blue" leftSection="📄">
          Download Ticket
        </Button>
        <Button onClick={() => navigate("/myOrder")} color="purple" leftSection="📋">
          View My Orders
        </Button>
        <Button onClick={() => navigate("/")} color="teal" leftSection="🏠">
          Go to Home
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccess;