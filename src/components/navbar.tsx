import React, { FC, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/image1.png';
import { useTheme } from './ThemeContext'; // Import useTheme

interface NavbarProps {}

const Navbar: FC<NavbarProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { theme, toggleTheme } = useTheme(); // Use the theme context

  // Check for login state on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/'); // Redirect to login page after logout
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <React.Fragment>
      <header className={`bg-${theme === 'light' ? 'white' : 'gray-800'} shadow`}>
        <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8 justify-between">
          {location.pathname !== '/' && (
            <div
              onClick={handleGoBack}
              className={`cursor-pointer text-${theme === 'light' ? 'teal-600' : 'teal-400'} hover:text-${theme === 'light' ? 'teal-700' : 'teal-300'}`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          )}
          <a className="cursor-pointer block text-teal-600" onClick={() => navigate('/')}>
            <span className="sr-only">Home</span>
            <img src={logo} alt="Logo" width={50} height={50} />
          </a>
          <p className={`font-bold text-xl mt-2 mb-2 text-${theme === 'light' ? 'black' : 'white'}`}>CineHub</p>

          <div className="flex flex-1 items-center justify-end cursor-pointer">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full focus:outline-none ${
                  theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'
                }`}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              <div className="sm:flex sm:gap-4">
                {isLoggedIn ? (
                  <div
                    onClick={handleLogout}
                    className="block rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
                  >
                    Logout
                  </div>
                ) : (
                  <div
                    onClick={() => navigate('/login')}
                    className="block rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
                  >
                    Login
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

export default Navbar;