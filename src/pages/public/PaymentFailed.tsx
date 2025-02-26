import { Button, Text, Title } from "@mantine/core";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useTheme } from "../../components/ThemeContext";
import failedIcon from "../../assets/payment-failed.png"; // Ensure this exists

interface Movie {
  imdbID: string;
  title: string;
  language: string;
  poster: string;
}

interface LocationState {
  movie?: Movie;
  movieId?: string;
  date?: string;
  theater?: string;
  slot?: string;
  seats?: string[];
  totalAmount?: number;
}

const PaymentFailed: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const state = location.state as LocationState;

  const handleRetryPayment = () => {
    const { movieId, date, theater, slot, movie } = state || {};
    console.log("Retry Payment State:", { movieId, date, theater, slot, movie });

    // Use params from state (direct failure) or query params (Stripe failure)
    const finalMovieId = movieId || searchParams.get("movieId");
    const finalDateId = date || searchParams.get("date"); // Expecting IDs
    const finalTheaterId = theater || searchParams.get("theater"); // Expecting IDs
    const finalSlotId = slot || searchParams.get("slot"); // Expecting IDs

    if (finalMovieId && finalDateId && finalTheaterId && finalSlotId) {
      navigate(`/seat/${finalMovieId}/${finalDateId}/${finalTheaterId}/${finalSlotId}`, {
        state: {
          movie: movie || { title: "Unknown Title", language: "Unknown Language", poster: "/images/placeholder.jpg" },
        },
      });
    } else {
      console.warn("Missing params for retry, redirecting to home");
      navigate("/");
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
        className={`max-w-md w-full mx-4 my-8 p-6 rounded-3xl shadow-xl text-center ${
          theme === "light"
            ? "bg-white bg-gradient-to-br from-gray-50 to-teal-50"
            : "bg-gray-800 bg-gradient-to-br from-gray-900 to-teal-900"
        }`}
      >
        {/* Failed Icon */}
        <img
          src={failedIcon}
          alt="Payment Failed"
          className="w-24 h-24 mx-auto mb-6 animate-pulse"
        />

        {/* Failure Message */}
        <Title
          order={1}
          c="red.6"
          fw={900}
          className="mb-4"
          style={{ fontFamily: "'Poppins', sans-serif", textShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)" }}
        >
          Payment Failed
        </Title>
        <Text
          size="md"
          c={theme === "light" ? "gray.7" : "gray.2"}
          className="mb-6"
        >
          Oops! Something went wrong with your payment.
        </Text>

        {/* Retry & Home Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleRetryPayment}
            radius="xl"
            size="lg"
            className={`w-full sm:w-40 ${
              theme === "light"
                ? "bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800"
                : "bg-gradient-to-r from-teal-600 to-teal-800 hover:from-teal-700 hover:to-teal-900"
            } text-white transition-all duration-200 transform hover:scale-105 shadow-md`}
          >
            Retry Payment
          </Button>
          <Button
            onClick={() => navigate("/")}
            radius="xl"
            size="lg"
            variant="outline"
            className={`w-full sm:w-40 ${
              theme === "light"
                ? "border-teal-500 text-teal-500 hover:bg-teal-100"
                : "border-teal-400 text-teal-400 hover:bg-teal-900"
            } transition-all duration-200 transform hover:scale-105`}
          >
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;