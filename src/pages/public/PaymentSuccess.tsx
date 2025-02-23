import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import axios from "axios";
import { Button, Text, Loader, Image } from "@mantine/core";

interface TicketDetails {
  movieId: string;
  movie: string;
  theatre: string;
  date: string;
  time: string;
  seats: string[];
  price: number;
  poster: string;
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
        console.log("Fetched session metadata from backend:", metadata);

        const dynamicDetails: TicketDetails = {
          movieId: metadata.movieId,
          movie: metadata.movieTitle,
          theatre: metadata.theatre,
          date: metadata.date,
          time: metadata.time,
          seats: JSON.parse(metadata.seats),
          price: parseInt(metadata.totalAmount, 10),
          poster: metadata.poster,
        };

        console.log("Constructed ticket details:", dynamicDetails);

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
          poster: details.poster,
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
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a5", // A5 size for ticket-like feel (148 x 210 mm)
        });
        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, "PNG", 0, 0, width, height);
        pdf.save(`CineHub-Ticket-${ticketDetails.movie}.pdf`);
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
        className="bg-white text-black p-6 rounded-xl shadow-lg w-[420px] relative overflow-hidden"
        style={{
          border: "2px solid #0d9488",
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
          background: "linear-gradient(135deg, #ffffff, #f0f0f0)",
        }}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <Text fw={700} size="xl" c="teal.7">
            CineHub Ticket
          </Text>
          <Text size="sm" c="gray.6">
            #{ticketDetails.movieId.slice(-6)}
          </Text>
        </div>

        {/* Poster and Details */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-center">
            <Image
              src={ticketDetails.poster}
              alt={ticketDetails.movie}
              width={120}
              height={180}
              className="rounded-md shadow-md"
            />
          </div>
          <div className="text-center">
            <Text fw={600} size="lg" c="gray.9" lineClamp={1}>
              {ticketDetails.movie}
            </Text>
            <Text size="md" c="gray.6" className="italic">
              {ticketDetails.theatre}
            </Text>
          </div>
        </div>

        {/* Details Grid */}
        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-300 pt-4">
          <div>
            <Text size="sm" c="gray.7">
              <strong>Date:</strong>
            </Text>
            <Text size="sm" c="gray.9">
              {ticketDetails.date}
            </Text>
          </div>
          <div>
            <Text size="sm" c="gray.7">
              <strong>Time:</strong>
            </Text>
            <Text size="sm" c="gray.9">
              {ticketDetails.time}
            </Text>
          </div>
          <div className="col-span-2">
            <Text size="sm" c="gray.7">
              <strong>Seats:</strong>
            </Text>
            <Text size="sm" c="gray.9">
              {ticketDetails.seats.join(", ")}
            </Text>
          </div>
        </div>

        {/* Price */}
        <div className="mt-4 border-t border-gray-300 pt-2 text-center">
          <Text fw={700} size="lg" c="teal.7">
            ₹{ticketDetails.price}
          </Text>
        </div>

        {/* Barcode */}
        <div className="mt-4 flex justify-center gap-1">
          {Array(20)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="w-1 h-6"
                style={{ backgroundColor: i % 2 === 0 ? "#000" : "#fff" }}
              />
            ))}
        </div>

        {/* Perforated Edge Effect */}
        <div
          className="absolute top-0 left-[-10px] w-10 h-full"
          style={{
            background: "radial-gradient(circle, rgba(0,0,0,0.1) 2px, transparent 2px)",
            backgroundSize: "10px 10px",
          }}
        />
        <div
          className="absolute top-0 right-[-10px] w-10 h-full"
          style={{
            background: "radial-gradient(circle, rgba(0,0,0,0.1) 2px, transparent 2px)",
            backgroundSize: "10px 10px",
          }}
        />
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