import React, { useState } from "react";
import { Star, Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "../../usetheme/UseTheme.jsx";
import { useLocation, useNavigate } from "react-router-dom";

const Header = ({ user }) => {
  const { dark, setDark } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

// Inside your component
const location = useLocation();

// Check if current path is "/" or "/signup"
const hideButtons =
  location.pathname === "/" || location.pathname === "/sign";
  return (
    <header className=" absolute w-full top-0 z-40">
      <div
        className={`max-w-7xl mx-auto px-6 py-4 flex items-center justify-between backdrop-blur-xl rounded-b-xl transition-colors duration-500 shadow-md 
        `}
      >
        <div className="flex items-center space-x-4">
          <h1
            className="text-2xl font-extrabold flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <Star className="w-8 h-8 mr-2 text-green-500 animate-pulse" />
            <span className="text-xl text-white">MentorSphere</span>
          </h1>

         
          
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            user.role === "student" ? (
              <button
                onClick={() => navigate("/bookedMentor")}
                className="px-4 py-2 rounded-full text-sm font-medium bg-green-500/95 text-white hover:bg-green-500/80 shadow"
              >
                Booked Mentors
              </button>
            ) : (
              <button
                onClick={() => navigate("/bookedUser")}
                className="px-4 py-2 rounded-full text-sm font-medium bg-blue-500/95 text-white hover:bg-blue-500/80 shadow"
              >
                Booked Users
              </button>
            )
          ) : (
            <button
              onClick={() => navigate("/signup")}
              className="px-4 py-2 rounded-full text-sm font-medium bg-white text-gray-800 shadow"
            >
              Sign Up
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow"
            aria-label="Open mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/20 dark:bg-black/60 backdrop-blur-xl shadow-lg flex flex-col items-center py-4 space-y-3 border-b border-gray-200 dark:border-gray-700 transition-all">
          <div className="w-full px-6">
            {!hideButtons && (
              <>
                {user ? (
                  user.role === "student" ? (
                    <button
                      onClick={() => {
                        navigate("/bookedMentor");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-2 rounded-full text-white bg-green-500/95"
                    >
                      Booked Mentors
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        navigate("/bookedUser");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-2 rounded-full text-white bg-blue-500/95"
                    >
                      Booked Users
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => {
                      navigate("/signup");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 rounded-full bg-white text-gray-800"
                  >
                    Sign Up
                  </button>
                )}

                
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
