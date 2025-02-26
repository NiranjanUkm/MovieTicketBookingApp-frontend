import { Button, Image, Text, Title } from "@mantine/core"; // Added Text, Title imports
import { FC, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useTheme } from "../../components/ThemeContext";

interface Movie {
  imdbID: string;
  Title: string;
  Poster: string;
  Plot: string;
  Language: string;
  imdbRating: string;
}

const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const DetailsPage: FC = () => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?i=${id}&apikey=${OMDB_API_KEY}`
        );
        const data = await response.json();
        if (data.Response === "True") {
          setMovie(data);
        } else {
          setMovie(null);
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleBookNow = () => {
    const token = localStorage.getItem("token");
    if (token && movie) {
      navigate(`/slot/${movie.imdbID}`, {
        state: {
          movie: {
            imdbID: movie.imdbID,
            title: movie.Title,
            language: movie.Language,
            poster: movie.Poster,
          },
        },
      });
    } else {
      navigate("/login", { state: { from: location } });
    }
  };

  if (!movie) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-600" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex justify-center items-center ${
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
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="md:w-1/3 w-full flex justify-center">
            <div className="relative w-64 h-96 rounded-2xl overflow-hidden shadow-lg transform transition-transform hover:scale-105">
              <Image
                src={movie.Poster}
                alt={movie.Title}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Details */}
          <div className="md:w-2/3 w-full flex flex-col justify-center">
            <Title
              order={1}
              c={theme === "light" ? "teal.7" : "teal.4"}
              fw={900}
              className="mb-4 text-center md:text-left"
              style={{ fontFamily: "'Poppins', sans-serif", textShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)" }}
            >
              {movie.Title}
            </Title>
            <Text
              size="md"
              c={theme === "light" ? "gray.7" : "gray.2"}
              className="mb-4 text-center md:text-left leading-relaxed"
            >
              {movie.Plot}
            </Text>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-4">
              {movie.Language.split(", ").map((language) => (
                <span
                  key={language}
                  className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors duration-200 ${
                    theme === "light"
                      ? "border-teal-500 text-teal-600 bg-teal-50 hover:bg-teal-100"
                      : "border-teal-400 text-teal-300 bg-teal-950 hover:bg-teal-900"
                  }`}
                >
                  {language}
                </span>
              ))}
            </div>
            <Text
              size="lg"
              c={theme === "light" ? "gray.6" : "gray.3"}
              className="mb-6 text-center md:text-left"
            >
              IMDb Rating: <span className="font-bold text-teal-500">{movie.imdbRating}</span>
            </Text>
            <Button
              onClick={handleBookNow}
              radius="xl"
              size="lg"
              className={`w-full md:w-64 mx-auto md:mx-0 ${
                theme === "light"
                  ? "bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800"
                  : "bg-gradient-to-r from-teal-600 to-teal-800 hover:from-teal-700 hover:to-teal-900"
              } text-white transition-all duration-200 transform hover:scale-105 shadow-md`}
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;