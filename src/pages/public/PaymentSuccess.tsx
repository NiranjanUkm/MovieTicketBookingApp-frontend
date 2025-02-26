import { Button, Text, Loader, Image } from "@mantine/core";
import { FC, useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { useTheme } from "../../components/ThemeContext";

interface TicketDetails {
  movieId: string;
  movie: string;
  theatre: string;
  date: string;
  time: string;
  seats: string[];
  price: number;
  poster: string;
  orderId?: string;
}

const PaymentSuccess: FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ticketRef = useRef<HTMLDivElement>(null);
  const [bookingStatus, setBookingStatus] = useState<"loading" | "success" | "error" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [ticketDetails, setTicketDetails] = useState<TicketDetails | null>(null);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    console.log("PaymentSuccess loaded with URL:", window.location.href);
    console.log("Search params:", Object.fromEntries(searchParams));

    const fetchTicketDetails = async () => {
      console.log("Fetching ticket details with session ID:", sessionId);
      if (!sessionId) {
        console.error("No session ID found in URL params");
        setErrorMessage("No payment session found. Redirecting to home...");
        setBookingStatus("error");
        setTimeout(() => navigate("/"), 3000);
        return;
      }

      try {
        const response = await axios.get(
          `https://cinehub-backend.onrender.com/api/payments/session/${sessionId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          }
        );

        console.log("Session response:", response.data);
        const { metadata } = response.data;

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
  }, [sessionId, navigate]);

  const bookTicket = async (details: TicketDetails) => {
    setBookingStatus("loading");
    setErrorMessage(null);

    console.log("Booking ticket with details:", details);

    try {
      const response = await axios.post(
        "https://cinehub-backend.onrender.com/api/orders/createOrder",
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
      setTicketDetails((prev) => (prev ? { ...prev, orderId: response.data.order._id } : null));
      setBookingStatus("success");
    } catch (error: any) {
      console.error("Error booking ticket:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "An error occurred while booking.");
      setBookingStatus("error");
    }
  };

  const handleDownloadPDF = () => {
    if (!ticketRef.current || !ticketDetails) return;

    toPng(ticketRef.current, { quality: 0.95 })
      .then((imgData) => {
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a5",
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

  const qrCodeUrl = ticketDetails?.orderId
    ? `https://cinehub-backend.onrender.com/api/tickets/${ticketDetails.orderId}`
    : "https://cinehub-backend.onrender.com";

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        theme === "light" ? "bg-gray-100" : "bg-gray-900"
      }`}
      style={{
        backgroundImage:
          theme === "light"
            ? "radial-gradient(circle at 10px 10px, #e5e7eb 1px, transparent 1px)"
            : "radial-gradient(circle at 10px 10px, #4b5563 1px, transparent 1px)",
        backgroundSize: "30px 30px",
      }}
    >
      <div
        className={`max-w-md w-full mx-4 my-8 p-6 rounded-3xl shadow-xl text-center ${
          theme === "light"
            ? "bg-white bg-gradient-to-br from-gray-50 to-teal-50"
            : "bg-gray-800 bg-gradient-to-br from-gray-900 to-teal-900"
        }`}
      >
        {/* Success Icon */}
        <Text size="xl" fw={700} c={theme === "light" ? "teal.7" : "teal.4"} mb="lg">
          🎉 Payment Successful! 🎉
        </Text>

        {bookingStatus === "loading" && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <Loader size="sm" color="teal" />
            <Text c={theme === "light" ? "gray.7" : "gray.2"}>Booking your ticket...</Text>
          </div>
        )}
        {bookingStatus === "success" && ticketDetails && (
          <Text c={theme === "light" ? "teal.6" : "teal.3"} mb="lg">
            Ticket booked successfully!
          </Text>
        )}
        {bookingStatus === "error" && (
          <Text c="red" mb="lg">
            {errorMessage}
          </Text>
        )}

        {ticketDetails && bookingStatus === "success" && (
          <div
            ref={ticketRef}
            className="bg-white text-black p-6 rounded-xl shadow-lg w-full max-w-[420px] relative overflow-hidden mx-auto"
            style={{
              backgroundColor: "#ffffff", // Force white background
              border: "2px solid #0d9488",
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
              backgroundImage: "linear-gradient(135deg, #ffffff, #f0f0f0), radial-gradient(circle at 5px 5px, #d1d5db 1px, transparent 1px)",
              backgroundSize: "100% 100%, 20px 20px",
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

            {/* QR Code */}
            <div className="mt-4 flex justify-center">
              <QRCodeCanvas
                value={qrCodeUrl}
                size={100}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
              />
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
        )}

        {bookingStatus !== "loading" && (
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleDownloadPDF}
              radius="xl"
              size="md"
              disabled={!ticketDetails || bookingStatus !== "success"}
              className="w-full sm:min-w-[180px] bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-105 shadow-md px-6 py-2 whitespace-nowrap"
            >
              Download Ticket
            </Button>
            <Button
              onClick={() => navigate("/my-orders")}
              radius="xl"
              size="md"
              className="w-full sm:min-w-[180px] bg-purple-500 hover:bg-purple-600 text-white transition-all duration-200 transform hover:scale-105 shadow-md px-6 py-2 whitespace-nowrap"
            >
              View My Orders
            </Button>
            <Button
              onClick={() => navigate("/")}
              radius="xl"
              size="md"
              className="w-full sm:min-w-[180px] bg-teal-500 hover:bg-teal-600 text-white transition-all duration-200 transform hover:scale-105 shadow-md px-6 py-2 whitespace-nowrap"
            >
              Go to Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;  