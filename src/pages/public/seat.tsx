import { Button } from "@mantine/core";
import React, { FC, useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useTheme } from "../../components/ThemeContext";

interface BookingParams {
  movieId?: string;
  date?: string;
  theater?: string;
  slot?: string;
  [key: string]: string | undefined;
}

interface SeatPageProps {}

const SeatPage: FC<SeatPageProps> = () => {
  const { theme } = useTheme();
  const { movieId, date, theater, slot } = useParams<BookingParams>();
  const location = useLocation();
  const [seating, setSeating] = useState<any[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const { movie } = location.state || {
    movie: { title: "Unknown Title", language: "Unknown Language", poster: "/images/placeholder.jpg" },
  };

  const theaters = [
    {
      name: "PVR Cinemas",
      id: "theater-123",
      slots: [
        { id: "slot-123", time: "10:00 AM" },
        { id: "slot-124", time: "1:00 PM" },
        { id: "slot-125", time: "4:00 PM" },
        { id: "slot-126", time: "7:00 PM" },
        { id: "slot-127", time: "10:00 PM" },
      ],
    },
    {
      name: "INOX Cinemas",
      id: "theater-124",
      slots: [
        { id: "slot-223", time: "10:00 AM" },
        { id: "slot-224", time: "1:00 PM" },
        { id: "slot-225", time: "4:00 PM" },
        { id: "slot-226", time: "7:00 PM" },
        { id: "slot-227", time: "10:00 PM" },
      ],
    },
  ];

  const dates = [
    { id: "date-123", date: "22 July" },
    { id: "date-124", date: "23 July" },
    { id: "date-125", date: "24 July" },
  ];

  const generateSeatingGrid = (rows: number, cols: number) => {
    const seating = [];
    const rowLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < rows; i++) {
      for (let j = 1; j <= cols; j++) {
        seating.push({
          status: "available",
          id: `${rowLetters[i]}${j}`,
        });
      }
    }
    return seating;
  };

  useEffect(() => {
    setSeating(generateSeatingGrid(7, 7));
  }, []);

  const handleSeatSelection = (seatId: string) => {
    setSelectedSeats((prevSelectedSeats) =>
      prevSelectedSeats.includes(seatId)
        ? prevSelectedSeats.filter((id) => id !== seatId)
        : [...prevSelectedSeats, seatId]
    );
  };

  const getSeatColor = (seat: any) => {
    if (seat.status === "unavailable") {
      return theme === "light" ? "bg-black" : "bg-gray-700";
    } else if (selectedSeats.includes(seat.id)) {
      return "bg-teal-500";
    } else {
      return theme === "light" ? "bg-gray-400" : "bg-gray-600";
    }
  };

  const handlePayment = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat!");
      return;
    }

    try {
      const totalAmount = selectedSeats.length * 150;
      const bookingPayload = {
        movieId: movieId,
        movieTitle: movie.title,
        theatre: theaters.find((t) => t.id === theater)?.name || "Unknown Theatre",
        date: dates.find((d) => d.id === date)?.date || "Unknown Date",
        time: theaters
          .find((t) => t.id === theater)
          ?.slots.find((s) => s.id === slot)?.time || "Unknown Time",
        seats: selectedSeats,
        totalAmount,
        poster: movie.poster, // Add poster to payload
      };

      console.log("Sending payment payload from SeatPage:", bookingPayload);

      const paymentResponse = await fetch(
        "http://localhost:4001/api/payments/create-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(bookingPayload),
        }
      );

      const paymentData = await paymentResponse.json();

      if (paymentResponse.ok && paymentData.url) {
        window.location.href = paymentData.url;
      } else {
        console.error("Payment Error:", paymentData.error);
        alert("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment Request Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <React.Fragment>
      <div
        className={`flex items-center flex-col justify-center mt-5 ${
          theme === "light" ? "bg-gray-100" : "bg-gray-900"
        }`}
      >
        <div
          className={`container rounded-2xl p-4 flex justify-center items-center flex-col ${
            theme === "light" ? "bg-white" : "bg-gray-800"
          }`}
        >
          <div className="w-full max-w-[30rem] mx-auto my-6">
            <div className="grid grid-cols-7 gap-2">
              {seating.map((seat) => (
                <div
                  key={seat.id}
                  className={`w-12 h-12 flex items-center justify-center font-bold ${getSeatColor(
                    seat
                  )} rounded-md cursor-pointer ${
                    theme === "light" ? "text-white" : "text-gray-100"
                  }`}
                  onClick={() => handleSeatSelection(seat.id)}
                >
                  {seat.id}
                </div>
              ))}
            </div>
            <p
              className={`text-center mt-4 ${
                theme === "light" ? "text-black" : "text-white"
              }`}
            >
              SCREEN HERE
            </p>
          </div>

          <Button
            className="mt-4"
            w={200}
            style={{ backgroundColor: "#0d9488" }}
            disabled={selectedSeats.length <= 0}
            onClick={handlePayment}
          >
            Confirm
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SeatPage;