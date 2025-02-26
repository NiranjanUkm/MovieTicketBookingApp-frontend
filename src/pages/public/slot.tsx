import { Button, Text, Title } from "@mantine/core";
import { FC, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useTheme } from "../../components/ThemeContext";

interface SlotPageProps {}

interface Movie {
  imdbID: string;
  title: string;
  language: string;
  poster: string;
}

interface DateItem {
  id: string;
  day: string;
  date: string;
}

interface Slot {
  id: string;
  time: string;
  description?: string;
}

interface Theater {
  name: string;
  id: string;
  description: string;
  slots: Slot[];
}

const SlotPage: FC<SlotPageProps> = () => {
  const { theme } = useTheme();
  const [date, setDate] = useState("");
  const [theater, setTheater] = useState("");
  const [slot, setSlot] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const { movie } = (location.state as { movie: Movie }) || {
    movie: { imdbID: "unknown", title: "Unknown Title", language: "Unknown Language", poster: "/images/placeholder.jpg" },
  };

  const theaters: Theater[] = [
    {
      name: "PVR Cinemas",
      id: "theater-123",
      description: "Beverages, Snacks, Recliner Seats",
      slots: [
        { id: "slot-123", time: "10:00 AM", description: "Dolby 5.1" },
        { id: "slot-124", time: "1:00 PM", description: "Dolby 5.1" },
        { id: "slot-125", time: "4:00 PM" },
        { id: "slot-126", time: "7:00 PM" },
        { id: "slot-127", time: "10:00 PM" },
      ],
    },
    {
      name: "INOX Cinemas",
      id: "theater-124",
      description: "Beverages, Snacks, Recliner Seats",
      slots: [
        { id: "slot-223", time: "10:00 AM", description: "Dolby 5.1" },
        { id: "slot-224", time: "1:00 PM", description: "Dolby 5.1" },
        { id: "slot-225", time: "4:00 PM" },
        { id: "slot-226", time: "7:00 PM" },
        { id: "slot-227", time: "10:00 PM" },
      ],
    },
    {
      name: "Cineplex Odeon",
      id: "theater-125",
      description: "Popcorn, IMAX Experience",
      slots: [
        { id: "slot-323", time: "9:30 AM", description: "IMAX" },
        { id: "slot-324", time: "12:30 PM", description: "IMAX" },
        { id: "slot-325", time: "3:30 PM" },
        { id: "slot-326", time: "6:30 PM" },
        { id: "slot-327", time: "9:30 PM" },
      ],
    },
    {
      name: "Regal Cinemas",
      id: "theater-126",
      description: "Luxury Seating, 4DX Available",
      slots: [
        { id: "slot-423", time: "11:00 AM", description: "4DX" },
        { id: "slot-424", time: "2:00 PM" },
        { id: "slot-425", time: "5:00 PM", description: "4DX" },
        { id: "slot-426", time: "8:00 PM" },
        { id: "slot-427", time: "11:00 PM" },
      ],
    },
    {
      name: "AMC Theatres",
      id: "theater-127",
      description: "Dolby Atmos, Snack Bar",
      slots: [
        { id: "slot-523", time: "10:30 AM", description: "Dolby Atmos" },
        { id: "slot-524", time: "1:30 PM" },
        { id: "slot-525", time: "4:30 PM", description: "Dolby Atmos" },
        { id: "slot-526", time: "7:30 PM" },
        { id: "slot-527", time: "10:30 PM" },
      ],
    },
    {
      name: "Miraj Cinemas",
      id: "theater-128",
      description: "Affordable Tickets, Comfort Seating",
      slots: [
        { id: "slot-623", time: "9:00 AM" },
        { id: "slot-624", time: "12:00 PM" },
        { id: "slot-625", time: "3:00 PM" },
        { id: "slot-626", time: "6:00 PM" },
        { id: "slot-627", time: "9:00 PM" },
      ],
    },
  ];

  const dates: DateItem[] = [
    { id: "date-123", day: "Mon", date: "22 July" },
    { id: "date-124", day: "Tue", date: "23 July" },
    { id: "date-125", day: "Wed", date: "24 July" },
    { id: "date-126", day: "Thu", date: "25 July" },
    { id: "date-127", day: "Fri", date: "26 July" },
  ];

  const handleSlotSelection = (theaterId: string, slotId: string) => {
    setTheater(theaterId);
    setSlot(slotId);
  };

  const handleProceed = () => {
    if (date && theater && slot && id) {
      navigate(`/seat/${id}/${date}/${theater}/${slot}`, { state: { movie } });
    } else {
      alert("Please select a date, theater, and time slot before proceeding.");
    }
  };

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
        className={`max-w-5xl w-full mx-4 my-8 p-6 rounded-3xl shadow-xl ${
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
            {movie.language}
          </Text>
        </div>

        {/* Date Selection */}
        <div className="mb-8">
          <Text
            size="lg"
            fw={700}
            c={theme === "light" ? "gray.8" : "gray.2"}
            className="mb-4 text-center md:text-left"
          >
            Select Date
          </Text>
          <div className="flex flex-wrap justify-center gap-4">
            {dates.map((dateItem) => (
              <div
                key={dateItem.id}
                className={`p-4 rounded-xl font-semibold text-center cursor-pointer transition-transform duration-200 transform hover:scale-105 ${
                  date === dateItem.id
                    ? theme === "light"
                      ? "bg-teal-200 text-teal-700 shadow-md"
                      : "bg-teal-700 text-teal-300 shadow-md"
                    : theme === "light"
                    ? "bg-teal-100 text-teal-600 hover:bg-teal-200"
                    : "bg-teal-900 text-teal-400 hover:bg-teal-800"
                }`}
                onClick={() => setDate(dateItem.id)}
              >
                <Text size="sm" fw={700}>
                  {dateItem.day}
                </Text>
                <Text size="xs" c={theme === "light" ? "gray.6" : "gray.4"}>
                  {dateItem.date}
                </Text>
              </div>
            ))}
          </div>
        </div>

        {/* Theater & Slot Selection */}
        <div className="flex flex-col gap-6">
          {theaters.map((theaterItem) => (
            <div
              key={theaterItem.id}
              className={`p-6 rounded-2xl shadow-lg ${
                theme === "light"
                  ? "bg-white border border-gray-200"
                  : "bg-gray-700 border border-gray-600"
              }`}
            >
              <Text
                size="lg"
                fw={700}
                c={theme === "light" ? "gray.9" : "gray.1"}
                className="mb-2"
              >
                {theaterItem.name}
              </Text>
              <Text
                size="sm"
                c={theme === "light" ? "gray.6" : "gray.4"}
                className="mb-4"
              >
                {theaterItem.description}
              </Text>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {theaterItem.slots.map((slotItem) => (
                  <div
                    key={slotItem.id}
                    className={`p-3 rounded-lg text-center cursor-pointer transition-transform duration-200 transform hover:scale-105 ${
                      slot === slotItem.id
                        ? theme === "light"
                          ? "bg-teal-200 text-teal-700 shadow-md"
                          : "bg-teal-700 text-teal-300 shadow-md"
                        : theme === "light"
                        ? "bg-teal-100 text-teal-600 hover:bg-teal-200"
                        : "bg-teal-900 text-teal-400 hover:bg-teal-800"
                    }`}
                    onClick={() => handleSlotSelection(theaterItem.id, slotItem.id)}
                  >
                    <Text size="sm" fw={700}>
                      {slotItem.time}
                    </Text>
                    {slotItem.description && (
                      <Text size="xs" c={theme === "light" ? "gray.6" : "gray.4"}>
                        {slotItem.description}
                      </Text>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Proceed Button */}
        <Button
          onClick={handleProceed}
          radius="xl"
          size="lg"
          disabled={!date || !theater || !slot}
          className={`mt-8 w-full md:w-64 mx-auto ${
            date && theater && slot
              ? theme === "light"
                ? "bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800"
                : "bg-gradient-to-r from-teal-600 to-teal-800 hover:from-teal-700 hover:to-teal-900"
              : theme === "light"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-600 cursor-not-allowed"
          } text-white transition-all duration-200 transform hover:scale-105 shadow-md`}
        >
          Proceed
        </Button>
      </div>
    </div>
  );
};

export default SlotPage;