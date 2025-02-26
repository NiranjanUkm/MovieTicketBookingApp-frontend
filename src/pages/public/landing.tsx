import React, { FC, useEffect, useState, useRef } from "react";
import { Carousel, CarouselSlide } from "@mantine/carousel"; // No need for CarouselImperativeRef
import { Image, Loader, TextInput, Button, Text, Title, Group } from "@mantine/core";
import { useTheme } from "../../components/ThemeContext";
import { Link, useLocation } from "react-router-dom";
import { FaStar } from "react-icons/fa";

interface Movie {
  imdbID: string;
  Title: string;
  Poster: string;
  Year: string;
  imdbRating?: string;
}

interface Banner {
  src: string;
  title: string;
}

const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const LandingPage: FC = () => {
  const { theme } = useTheme();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [banners] = useState<Banner[]>([
    {
      src: "https://assetscdn1.paytm.com/images/catalog/view_item/3006085/13825457253829748.jpg?format=webp&imwidth=1750",
      title: "Experience the Big Screen Magic",
    },
    {
      src: "https://assetscdn1.paytm.com/images/catalog/view_item/3003159/13953317297351282.jpg?format=webp&imwidth=1750",
      title: "Book Your Seats Now!",
    },
    {
      src: "https://assetscdn1.paytm.com/images/catalog/view_item/2973893/10885588356812674.png?format=webp&imwidth=1750",
      title: "Your Movie Adventure Awaits",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const topRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [embla, setEmbla] = useState<any>(null); // State to hold Embla API
  const location = useLocation();

  useEffect(() => {
    fetchLatestMovies();
  }, []);

  // Autoplay logic with useEffect
  useEffect(() => {
    if (!embla) return;

    const interval = setInterval(() => {
      console.log("Autoplay: Moving to next slide");
      embla.scrollNext(); // Use Embla’s scrollNext
    }, 3000); // 3 seconds delay

    return () => {
      console.log("Autoplay: Cleaning up interval");
      clearInterval(interval);
    };
  }, [embla]); // Depend on embla

  const fetchLatestMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?s=movie&apikey=${OMDB_API_KEY}&type=movie`
      );
      const data = await response.json();
      if (data.Response === "True") {
        const detailedMovies = await Promise.all(
          data.Search.map(async (movie: Movie) => {
            const detailResponse = await fetch(
              `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${OMDB_API_KEY}`
            );
            const detailData = await detailResponse.json();
            return { ...movie, imdbRating: detailData.imdbRating || "N/A", Year: detailData.Year };
          })
        );
        const latestMovies = detailedMovies
          .sort((a, b) => parseInt(b.Year) - parseInt(a.Year))
          .slice(0, 12);
        setMovies(latestMovies);
      } else {
        setMovies([]);
        setError("No movies found.");
      }
    } catch (err) {
      setError("Failed to fetch movies.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMovies = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?s=${query}&apikey=${OMDB_API_KEY}&type=movie`
      );
      const data = await response.json();
      if (data.Response === "True") {
        const detailedMovies = await Promise.all(
          data.Search.map(async (movie: Movie) => {
            const detailResponse = await fetch(
              `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${OMDB_API_KEY}`
            );
            const detailData = await detailResponse.json();
            return { ...movie, imdbRating: detailData.imdbRating || "N/A", Year: detailData.Year };
          })
        );
        setMovies(detailedMovies);
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

  const handleSearch = () => {
    if (search.trim()) {
      fetchMovies(search);
    }
  };

  useEffect(() => {
    if (location.state?.scrollToCards) {
      cardsRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return (
    <React.Fragment>
      <div ref={topRef} />
      {/* Enhanced Hero Carousel with Manual Autoplay */}
      <div className="max-w-5xl mx-auto mt-6">
        <Carousel
          withIndicators
          height={300}
          slideSize="70%"
          slideGap="md"
          align="center"
          slidesToScroll={1}
          loop
          getEmblaApi={setEmbla} // Set Embla API to state
          className="relative rounded-3xl overflow-hidden shadow-lg"
          styles={{
            control: {
              backgroundColor: theme === "light" ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.5)",
              color: theme === "light" ? "white" : "black",
            },
            indicator: {
              backgroundColor: theme === "light" ? "teal" : "teal",
              opacity: 0.7,
            },
          }}
        >
          {banners.map((banner, index) => (
            <CarouselSlide key={index} className="relative">
              <Image
                src={banner.src}
                fit="contain"
                height={300}
                width="100%"
                className="object-center"
                fallbackSrc="/images/placeholder.jpg"
              />
              <div
                className={`absolute inset-0 ${
                  theme === "light"
                    ? "bg-gradient-to-t from-gray-900/70 to-transparent"
                    : "bg-gradient-to-t from-teal-900/70 to-transparent"
                } flex items-center justify-center transition-opacity duration-300`}
              >
                <Text
                  size="2xl"
                  fw={900}
                  c={theme === "light" ? "white" : "white"}
                  className="text-center px-6 transform transition-transform duration-500 hover:scale-105"
                  style={{ fontFamily: "'Poppins', sans-serif", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
                >
                  {banner.title}
                </Text>
              </div>
            </CarouselSlide>
          ))}
        </Carousel>
      </div>

      {/* Search Bar */}
      <div className={`p-4 ${theme === "light" ? "bg-gray-100" : "bg-gray-900"}`}>
        <Group justify="center" gap="md" className="max-w-2xl mx-auto">
          <TextInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search movies..."
            radius="xl"
            size="md"
            variant="filled"
            className={`flex-1 focus:ring-2 focus:ring-teal-500 ${
              theme === "light" ? "bg-white" : "bg-gray-800"
            }`}
            styles={{
              input: {
                backgroundColor: theme === "light" ? "#ffffff" : "#4b5563",
                color: theme === "light" ? "#1f2937" : "#e5e7eb",
              },
            }}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button
            onClick={handleSearch}
            radius="xl"
            size="md"
            color="teal"
            className="bg-teal-600 hover:bg-teal-700 transition-colors"
          >
            Search
          </Button>
        </Group>
      </div>

      {/* Movie Grid */}
      <div
        className={`p-6 ${theme === "light" ? "bg-white" : "bg-gray-900"}`}
        style={{
          backgroundImage:
            theme === "light"
              ? "radial-gradient(circle at 10px 10px, #e5e7eb 1px, transparent 1px)"
              : "radial-gradient(circle at 10px 10px, #4b5563 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      >
        <Title
          order={2}
          c={theme === "light" ? "teal.7" : "teal.4"}
          fw={300}
          className="text-left py-6 ml-4"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          The Best For You
        </Title>
        <div ref={cardsRef} />

        {loading && (
          <div className="flex justify-center">
            <Loader color="teal" size="lg" />
          </div>
        )}

        {error && (
          <Text
            c={theme === "light" ? "red.5" : "red.4"}
            size="lg"
            className="text-center"
          >
            {error}
          </Text>
        )}

        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {movies.map((movie) => (
            <Link
              to={`/movie/${movie.imdbID}`}
              key={movie.imdbID}
              state={{ movie }}
              className="block"
            >
              <div
                className={`relative rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl group ${
                  theme === "light" ? "bg-gray-100" : "bg-gray-800"
                }`}
              >
                <Image
                  src={movie.Poster !== "N/A" ? movie.Poster : "/images/placeholder.jpg"}
                  alt={movie.Title}
                  height={300}
                  fit="cover"
                  className="w-full object-cover"
                />
                <div
                  className={`absolute inset-0 ${
                    theme === "light" ? "bg-black bg-opacity-30" : "bg-black bg-opacity-50"
                  } opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4`}
                >
                  <Text
                    fw={600}
                    size="md"
                    c={theme === "light" ? "white" : "white"}
                    lineClamp={1}
                  >
                    {movie.Title}
                  </Text>
                  <Text size="sm" c={theme === "light" ? "gray.2" : "gray.3"}>
                    {movie.Year}
                  </Text>
                  <Group gap="xs" mt="xs">
                    <FaStar className="text-yellow-400" />
                    <Text size="sm" c={theme === "light" ? "white" : "white"}>
                      {movie.imdbRating || "N/A"}
                    </Text>
                  </Group>
                </div>
                <div
                  className={`p-2 ${
                    theme === "light" ? "bg-gray-200" : "bg-gray-900"
                  } text-center`}
                >
                  <Text
                    fw={600}
                    size="sm"
                    c={theme === "light" ? "gray.9" : "white"}
                    lineClamp={1}
                  >
                    {movie.Title}
                  </Text>
                  <Text
                    size="xs"
                    c={theme === "light" ? "gray.6" : "gray.4"}
                  >
                    {movie.Year}
                  </Text>
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