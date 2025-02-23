import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import axios from "axios";
import { Button, Text, Loader } from "@mantine/core";

interface TicketDetails {
  movieId: string;
  movie: string;
  theatre: string;
  date: string;
  time: string;
  seats: string[];
  price: number;
}

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ticketRef = useRef<HTMLDivElement>(null);
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [ticketDetails, setTicketDetails] = useState<TicketDetails | null>(null);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      const params = new URLSearchParams(location.search);
      const sessionId = params.get("session_id");

      if (!sessionId) {
        setErrorMessage("No payment session found.");
        setBookingStatus("error");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:4001/api/payments/session/${sessionId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          }
        );

        const { metadata } = response.data;
        console.log("Fetched session metadata from backend:", metadata); // Debug metadata

        const dynamicDetails: TicketDetails = {
          movieId: metadata.movieId, // Ensure this matches SeatPage payload
          movie: metadata.movieTitle,
          theatre: metadata.theatre,
          date: metadata.date,
          time: metadata.time,
          seats: JSON.parse(metadata.seats),
          price: parseInt(metadata.totalAmount, 10),
        };

        console.log("Constructed ticket details:", dynamicDetails); // Debug before booking

        setTicketDetails(dynamicDetails);
        await bookTicket(dynamicDetails);
      } catch (error: any) {
        console.error("Error fetching session:", error.response?.data || error.message);
        setErrorMessage("Failed to load ticket details.");
        setBookingStatus("error");
      }
    };

    fetchTicketDetails();
  }, [location]);

  const bookTicket = async (details: TicketDetails) => {
    setBookingStatus("loading");
    setErrorMessage(null);

    console.log("Booking ticket with details:", details);

    try {
      const response = await axios.post(
        "http://localhost:4001/api/orders/createOrder",
        {
          movieId: details.movieId,
          title: details.movie,
          poster: `/images/${details.movieId}.jpg`,
          seats: details.seats,
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
      const errorDetails = error.response?.data || error.message;
      console.error("Error booking ticket:", JSON.stringify(errorDetails, null, 2));
      setBookingStatus("error");
      setErrorMessage(
        error.response?.data?.message || "An error occurred while booking."
      );
    }
  };

  const handleDownloadPDF = () => {
    if (!ticketRef.current || !ticketDetails) return;

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

  if (!ticketDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <Text size="xl" fw={700} c="green" mb="lg">
          🎉 Payment Successful! 🎉
        </Text>
        <Loader size="sm" color="gray" />
        <Text c="gray">Loading ticket details...</Text>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Text size="xl" fw={700} c="green" mb="lg">
        🎉 Payment Successful! 🎉
      </Text>

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

      <div className="mt-6 flex gap-4">
        <Button onClick={handleDownloadPDF} color="blue" leftSection="📄">
          Download Ticket
        </Button>
        <Button onClick={() => navigate("/my-orders")} color="purple" leftSection="📋">
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