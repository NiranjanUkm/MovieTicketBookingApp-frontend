import React, { FC, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaUserCircle,
  FaUser,
  FaTicketAlt,
  FaSignOutAlt,
  FaArrowLeft,
  FaHome,
  FaFilm,
} from "react-icons/fa";
import logo from "../assets/image1.png";
import { useTheme } from "./ThemeContext";
import { Button, ActionIcon, Group, Text, Tooltip } from "@mantine/core";

interface NavbarProps {}

const Navbar: FC<NavbarProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setDropdownOpen(false);
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleHomeClick = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" }); // Simplified scroll to top
  };

  const handleMoviesClick = () => {
    navigate("/");
    // We’ll handle card scrolling in LandingPage.tsx via an effect or ref
  };

  return (
    <React.Fragment>
      <header
        className={`sticky top-0 z-50 shadow-md ${
          theme === "light"
            ? "bg-gradient-to-r from-teal-50 to-teal-100"
            : "bg-gradient-to-r from-teal-900 to-teal-800"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-screen-2xl items-center gap-6 px-4 sm:px-6 lg:px-8 justify-between">
          {/* Back Arrow */}
          {location.pathname !== "/" && (
            <Tooltip label="Go Back">
              <ActionIcon
                onClick={handleGoBack}
                size="lg"
                variant="subtle"
                color={theme === "light" ? "teal.6" : "teal.4"}
                className={`hover:bg-${
                  theme === "light" ? "teal-200" : "teal-700"
                } transition-colors`}
              >
                <FaArrowLeft size={20} />
              </ActionIcon>
            </Tooltip>
          )}

          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <a
              className="block text-teal-600 cursor-pointer transform transition-transform hover:scale-110"
              onClick={() => navigate("/")}
            >
              <span className="sr-only">Home</span>
              <img src={logo} alt="CineHub Logo" width={60} height={60} />
            </a>
            <Text
              className={`text-2xl font-extralight tracking-wide ${
                theme === "light" ? "text-teal-800" : "text-teal-200"
              }`}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              CineHub
            </Text>
          </div>

          {/* Navigation Links */}
          <Group gap="lg" className="hidden md:flex">
            <Text
              className={`text-sm font-medium ${
                theme === "light"
                  ? "text-gray-800 hover:text-teal-600"
                  : "text-gray-100 hover:text-teal-400"
              } transition-colors cursor-pointer flex items-center gap-2`}
              onClick={handleHomeClick}
            >
              <FaHome /> Home
            </Text>
            <Text
              className={`text-sm font-medium ${
                theme === "light"
                  ? "text-gray-800 hover:text-teal-600"
                  : "text-gray-100 hover:text-teal-400"
              } transition-colors cursor-pointer flex items-center gap-2`}
              onClick={handleMoviesClick}
            >
              <FaFilm /> Movies
            </Text>
          </Group>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            {/* Theme Toggle */}
            <Tooltip label={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}>
              <ActionIcon
                onClick={toggleTheme}
                size="lg"
                variant="filled"
                color={theme === "light" ? "teal.6" : "gray.7"}
                className={`rounded-full transition-transform hover:scale-110 ${
                  theme === "light" ? "bg-teal-200" : "bg-gray-600"
                }`}
              >
                {theme === "light" ? "🌙" : "☀️"}
              </ActionIcon>
            </Tooltip>

            {/* Profile Dropdown or Login */}
            {isLoggedIn ? (
              <div className="relative">
                <Tooltip label="Profile Options">
                  <ActionIcon
                    size="xl"
                    variant="transparent"
                    color={theme === "light" ? "gray.9" : "gray.0"}
                    className={`hover:text-teal-500 transition-colors`}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <FaUserCircle size={28} />
                  </ActionIcon>
                </Tooltip>

                {dropdownOpen && (
                  <div
                    className={`absolute right-0 mt-3 w-56 rounded-xl shadow-xl overflow-hidden z-50 transition-all duration-300 ease-in-out ${
                      theme === "light"
                        ? "bg-white border-gray-200"
                        : "bg-gray-800 border-gray-700"
                    } border`}
                    style={{ transform: "translateY(5px)" }}
                  >
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/profile");
                      }}
                      className={`flex items-center gap-3 w-full px-4 py-3 text-sm ${
                        theme === "light"
                          ? "text-gray-800 hover:bg-teal-100 hover:text-teal-600"
                          : "text-gray-100 hover:bg-teal-700 hover:text-teal-300"
                      } transition-colors duration-150`}
                    >
                      <FaUser className="text-lg" />
                      <span>View Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/my-orders");
                      }}
                      className={`flex items-center gap-3 w-full px-4 py-3 text-sm ${
                        theme === "light"
                          ? "text-gray-800 hover:bg-teal-100 hover:text-teal-600"
                          : "text-gray-100 hover:bg-teal-700 hover:text-teal-300"
                      } transition-colors duration-150`}
                    >
                      <FaTicketAlt className="text-lg" />
                      <span>My Orders</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className={`flex items-center gap-3 w-full px-4 py-3 text-sm ${
                        theme === "light"
                          ? "text-red-600 hover:bg-red-100 hover:text-red-700"
                          : "text-red-400 hover:bg-red-800 hover:text-red-300"
                      } transition-colors duration-150`}
                    >
                      <FaSignOutAlt className="text-lg" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                radius="xl"
                size="md"
                className={`${
                  theme === "light"
                    ? "bg-gradient-to-r from-teal-500 to-teal-700 text-white hover:from-teal-600 hover:to-teal-800"
                    : "bg-gradient-to-r from-teal-600 to-teal-800 text-white hover:from-teal-700 hover:to-teal-900"
                } transition-all duration-200 transform hover:scale-105`}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

export default Navbar;