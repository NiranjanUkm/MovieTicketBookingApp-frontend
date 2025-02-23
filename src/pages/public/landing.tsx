import React, { FC, useEffect, useState } from "react";
import { Carousel } from "@mantine/carousel";
import { Image, Loader, TextInput, Button } from "@mantine/core";
import { useTheme } from "../../components/ThemeContext";
import { Link } from "react-router-dom";

interface Movie {
  imdbID: string;
  Title: string;
  Poster: string;
  Year: string;
}

const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const LandingPage: FC = () => {
  const { theme } = useTheme();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("batman");

  useEffect(() => {
    fetchMovies(search);
  }, []);

  const fetchMovies = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?s=${query}&apikey=${OMDB_API_KEY}`
      );
      const data = await response.json();
      if (data.Response === "True") {
        setMovies(data.Search);
      } else {
        setMovies([]);
        setError(data.Error || "No movies found.");
      }
    } catch (err) {
      setError("Failed to fetch movies.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Carousel withIndicators height={400} loop>
        <Carousel.Slide>
          <Image src="https://assets-in.bmscdn.com/promotions/cms/creatives/1728390794440_bandlanddesktop.jpg" />
        </Carousel.Slide>
        <Carousel.Slide>
          <Image src="/images/banner-2.avif" />
        </Carousel.Slide>
      </Carousel>

      <div className="flex items-center gap-2 p-3">
        <TextInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search movies..."
          className="w-full"
        />
        <Button onClick={() => fetchMovies(search)}>Search</Button>
      </div>

      <div className={`p-3 ${theme === "light" ? "bg-white" : "bg-gray-800"}`}>
        <p
          className={`font-semibold text-xl mb-2 ${
            theme === "light" ? "text-black" : "text-white"
          }`}
        >
          Trending now
        </p>

        {loading && (
          <div className="flex justify-center">
            <Loader color="blue" />
          </div>
        )}

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {movies.map((movie) => (
            <Link to={`/movie/${movie.imdbID}`} key={movie.imdbID} state={{ movie }}>
              <div className="border rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform transform hover:scale-105">
                <Image
                  src={movie.Poster !== "N/A" ? movie.Poster : "/images/placeholder.jpg"}
                  alt={movie.Title}
                  height={250}
                  className="w-full object-cover"
                />
                <div className="p-2 bg-gray-900 text-white text-center">
                  <p className="font-semibold text-sm">{movie.Title}</p>
                  <p className="text-xs opacity-75">{movie.Year}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

export default LandingPage;