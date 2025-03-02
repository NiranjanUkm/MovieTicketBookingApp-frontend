import { Button, Text, Title } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../components/ThemeContext";

interface BookingParams {
  movieId?: string;
  date?: string;
  theater?: string;
  slot?: string;
  [key: string]: string | undefined;
}

interface Movie {
  title: string;
  language: string;
  poster: string;
}

interface Slot {
  id: string;
  time: string;
}

interface Theater {
  name: string;
  id: string;
  slots: Slot[];
}

interface Seat {
  status: "available" | "unavailable";
  id: string;
}

const SeatPage: FC = () => {
  const { theme } = useTheme();
  const { movieId, date, theater, slot } = useParams<BookingParams>();
  const location = useLocation();
  const navigate = useNavigate();
  const [seating, setSeating] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false); // Loading state

  const { movie } = (location.state as { movie: Movie }) || {
    movie: { title: "Unknown Title", language: "Unknown Language", poster: "/images/placeholder.jpg" },
  };

  const theaters: Theater[] = [
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
    {
      name: "Cineplex Odeon",
      id: "theater-125",
      slots: [
        { id: "slot-323", time: "9:30 AM" },
        { id: "slot-324", time: "12:30 PM" },
        { id: "slot-325", time: "3:30 PM" },
        { id: "slot-326", time: "6:30 PM" },
        { id: "slot-327", time: "9:30 PM" },
      ],
    },
    {
      name: "Regal Cinemas",
      id: "theater-126",
      slots: [
        { id: "slot-423", time: "11:00 AM" },
        { id: "slot-424", time: "2:00 PM" },
        { id: "slot-425", time: "5:00 PM" },
        { id: "slot-426", time: "8:00 PM" },
        { id: "slot-427", time: "11:00 PM" },
      ],
    },
    {
      name: "AMC Theatres",
      id: "theater-127",
      slots: [
        { id: "slot-523", time: "10:30 AM" },
        { id: "slot-524", time: "1:30 PM" },
        { id: "slot-525", time: "4:30 PM" },
        { id: "slot-526", time: "7:30 PM" },
        { id: "slot-527", time: "10:30 PM" },
      ],
    },
    {
      name: "Miraj Cinemas",
      id: "theater-128",
      slots: [
        { id: "slot-623", time: "9:00 AM" },
        { id: "slot-624", time: "12:00 PM" },
        { id: "slot-625", time: "3:00 PM" },
        { id: "slot-626", time: "6:00 PM" },
        { id: "slot-627", time: "9:00 PM" },
      ],
    },
  ];

  const dates = [
    { id: "date-123", date: "22 July" },
    { id: "date-124", date: "23 July" },
    { id: "date-125", date: "24 July" },
    { id: "date-126", date: "25 July" },
    { id: "date-127", date: "26 July" },
  ];

  const generateSeatingGrid = (rows: number, cols: number): Seat[] => {
    const seating: Seat[] = [];
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

  const getSeatColor = (seat: Seat) => {
    if (seat.status === "unavailable") {
      return theme === "light" ? "bg-gray-800" : "bg-gray-700";
    } else if (selectedSeats.includes(seat.id)) {
      return "bg-teal-500 hover:bg-teal-600";
    } else {
      return theme === "light" ? "bg-gray-300 hover:bg-gray-400" : "bg-gray-500 hover:bg-gray-600";
    }
  };

  const handlePayment = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat!");
      return;
    }

    setIsLoadingPayment(true); // Start loading
    const startTime = Date.now();

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
        poster: movie.poster,
        successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        failureUrl: `${window.location.origin}/payment-failed?movieId=${encodeURIComponent(
          movieId || ""
        )}&date=${encodeURIComponent(date || "")}&theater=${encodeURIComponent(
          theater || ""
        )}&slot=${encodeURIComponent(slot || "")}`,
      };

      console.log("Sending payment payload from SeatPage:", bookingPayload);
      const fetchStart = Date.now();
      console.log("Fetch start time:", fetchStart - startTime, "ms");

      const paymentResponse = await fetch(
        "https://cinehub-backend.onrender.com/api/payments/create-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(bookingPayload),
        }
      );

      const fetchEnd = Date.now();
      console.log("Fetch completed in:", fetchEnd - fetchStart, "ms");

      const paymentData = await paymentResponse.json();
      const parseEnd = Date.now();
      console.log("Response parsed in:", parseEnd - fetchEnd, "ms");

      if (paymentResponse.ok && paymentData.url) {
        console.log("Redirecting to Stripe checkout URL:", paymentData.url);
        const redirectStart = Date.now();
        window.location.href = paymentData.url;
        console.log("Redirect initiated in:", Date.now() - redirectStart, "ms"); // Might not log due to page unload
      } else {
        console.error("Payment Error:", paymentData.error);
        navigate("/payment-failed", {
          state: {
            movie,
            movieId,
            date,
            theater,
            slot,
            seats: selectedSeats,
            totalAmount,
          },
        });
      }
    } catch (error) {
      console.error("Payment Request Error:", error);
      navigate("/payment-failed", {
        state: {
          movie,
          movieId,
          date,
          theater,
          slot,
          seats: selectedSeats,
          totalAmount: selectedSeats.length * 150,
        },
      });
    } finally {
      setIsLoadingPayment(false); // End loading
      console.log("Total payment process time:", Date.now() - startTime, "ms");
    }
  };

  if (!movie || !movieId || !date || !theater || !slot) {
    console.error("Missing required params or movie state, redirecting to home");
    navigate("/");
    return null;
  }

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
        className={`max-w-4xl w-full mx-4 my-8 p-6 rounded-3xl shadow-xl ${
          theme === "light"
            ? "bg-white bg-gradient-to-br from-gray-50 to-teal-50"
            : "bg-gray-800 bg-gradient-to-br from-gray-900 to-teal-900"
        }`}
      >
        {/* Movie Info */}
        <div className="flex flex-col items-center mb-8">
          <Title
            order={1}
            c={theme === "light" ? "teal.7" : "teal.4"}
            fw={900}
            className="text-center"
            style={{ fontFamily: "'Poppins', sans-serif", textShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)" }}
          >
            {movie.title}
          </Title>
          <Text
            size="md"
            c={theme === "light" ? "gray.6" : "gray.3"}
            className="mt-2 text-center"
          >
            {theaters.find((t) => t.id === theater)?.name || "Unknown Theatre"} |{" "}
            {dates.find((d) => d.id === date)?.date || "Unknown Date"} |{" "}
            {theaters
              .find((t) => t.id === theater)
              ?.slots.find((s) => s.id === slot)?.time || "Unknown Time"}
          </Text>
        </div>

        {/* Seat Grid */}
        <div className="w-full max-w-[40rem] mx-auto mb-8">
          <div className="grid grid-cols-7 gap-3">
            {seating.map((seat) => (
              <div
                key={seat.id}
                className={`w-12 h-12 flex items-center justify-center font-semibold text-sm rounded-lg shadow-md cursor-pointer transition-transform duration-200 transform hover:scale-105 ${getSeatColor(
                  seat
                )} ${
                  seat.status === "unavailable" || selectedSeats.includes(seat.id)
                    ? "text-white"
                    : theme === "light"
                    ? "text-gray-800"
                    : "text-gray-200"
                }`}
                onClick={() => seat.status === "available" && handleSeatSelection(seat.id)}
              >
                {seat.id}
              </div>
            ))}
          </div>
          <div
            className={`mt-6 w-3/4 mx-auto h-10 rounded-t-full ${
              theme === "light" ? "bg-gray-300" : "bg-gray-600"
            } flex items-center justify-center`}
          >
            <Text
              size="sm"
              fw={700}
              c={theme === "light" ? "gray.8" : "gray.2"}
            >
              SCREEN
            </Text>
          </div>
        </div>

        {/* Confirm Button */}
        <Button
          onClick={handlePayment}
          radius="xl"
          size="lg"
          disabled={selectedSeats.length === 0 || isLoadingPayment}
          loading={isLoadingPayment} // Show loading spinner
          className={`w-full md:w-64 mx-auto ${
            selectedSeats.length > 0 && !isLoadingPayment
              ? theme === "light"
                ? "bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800"
                : "bg-gradient-to-r from-teal-600 to-teal-800 hover:from-teal-700 hover:to-teal-900"
              : theme === "light"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-600 cursor-not-allowed"
          } text-white transition-all duration-200 transform hover:scale-105 shadow-md`}
        >
          {isLoadingPayment ? "Processing..." : `Confirm (${selectedSeats.length} Seat${selectedSeats.length !== 1 ? "s" : ""})`}
        </Button>
      </div>
    </div>
  );
};

export default SeatPage;