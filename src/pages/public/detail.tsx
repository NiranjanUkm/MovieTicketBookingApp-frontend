import { Button, Image } from "@mantine/core";
import React, { FC, useEffect, useState } from "react";
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
        state: { movie: { imdbID: movie.imdbID, title: movie.Title, language: movie.Language } },
      });
    } else {
      navigate("/login", { state: { from: location } });
    }
  };

  if (!movie) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Loading movie details...</p>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div
        className={`flex justify-center min-h-dvh ${
          theme === "light" ? "bg-gray-100" : "bg-gray-900"
        } mt-5`}
      >
        <div className="container">
          <div className={`rounded-3xl p-4 ${theme === "light" ? "bg-white" : "bg-gray-800"}`}>
            {/* Desktop layout */}
            <div className="hidden md:flex gap-7">
              <div className="w-1/6 h-72 rounded-2xl overflow-hidden">
                <Image src={movie.Poster} alt={movie.Title} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-end">
                <p className={`font-semibold text-2xl mb-2 ${theme === "light" ? "text-black" : "text-white"}`}>
                  {movie.Title}
                </p>
                <p className={`${theme === "light" ? "text-gray-500" : "text-gray-300"} mb-2`}>
                  {movie.Plot}
                </p>
                <div className="flex gap-2">
                  {movie.Language.split(", ").map((language) => (
                    <span
                      key={language}
                      className={`px-2 py-1 rounded-md ${
                        theme === "light" ? "bg-gray-100" : "bg-gray-700 text-white"
                      }`}
                    >
                      {language}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300">IMDb Rating: {movie.imdbRating}</p>
                <Button className="mt-4" w={200} style={{ backgroundColor: "#0d9488" }} onClick={handleBookNow}>
                  Book now
                </Button>
              </div>
            </div>

            {/* Mobile layout */}
            <div className="flex flex-col gap-5 md:hidden">
              <div className="w-full h-73 rounded-2xl overflow-hidden mb-4">
                <Image src={movie.Poster} alt={movie.Title} className="w-full h-full object-cover" />
              </div>
              <div className="text-center">
                <p className={`font-semibold text-2xl mb-2 ${theme === "light" ? "text-black" : "text-white"}`}>
                  {movie.Title}
                </p>
                <p className={`${theme === "light" ? "text-gray-500" : "text-gray-300"} mb-2`}>
                  {movie.Plot}
                </p>
                <div className="flex gap-2 justify-center">
                  {movie.Language.split(", ").map((language) => (
                    <span
                      key={language}
                      className={`px-2 py-1 rounded-md ${
                        theme === "light" ? "bg-gray-100" : "bg-gray-700 text-white"
                      }`}
                    >
                      {language}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300">IMDb Rating: {movie.imdbRating}</p>
                <Button className="mt-4" w={200} style={{ backgroundColor: "#0d9488" }} onClick={handleBookNow}>
                  Book now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default DetailsPage;