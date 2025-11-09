import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import background from '../../image/background1.png'
// --- Replacement for react-icons/fa ---
const Icon = ({ children, className }) => (
  <div className={className}>{children}</div>
);
const FaFacebookF = () => <Icon className="text-gray-600 w-5 h-5">F</Icon>;
const FaTwitter = () => <Icon className="text-gray-600 w-5 h-5">T</Icon>;
const FaGoogle = () => <Icon className="text-gray-600 w-5 h-5">G</Icon>;
const FaApple = () => <Icon className="text-gray-600 w-5 h-5">A</Icon>;
// ----------------------------------------

// --- Replacement for ../loginHead/LoginHeader.jsx ---
const LoginHeader = ({ showBackButton, showTitle, onBackClick }) => {
  const navigate = useNavigate();

  return (
    <div className="relative z-20 flex items-center justify-between p-4 bg-transparent">
      {showBackButton && (
        <button
          onClick={onBackClick}
          className="text-white text-2xl font-bold p-2 transition-transform hover:scale-105"
          aria-label="Back"
        >
          &larr;
        </button>
      )}
      {showTitle && (
        <div className="text-white text-2xl font-extrabold mx-auto">
          MentorSphere
        </div>
      )}
      {!showBackButton && !showTitle && <div className="w-10"></div>}{" "}
      {/* Spacer */}
    </div>
  );
};
// -----------------------------------------------------

// Changed from 'export const Login = () => {' to 'const Login = () => {'
export const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true); // To manage the intro screen

  // NOTE: In a real environment, you should handle login securely and not use `alert()`.
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    setLoading(true);
    try {
      // Placeholder API call. This will likely fail without a live backend.
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(`Unexpected response: ${text}`);
      }

      if (res.ok) {
        localStorage.setItem("token", data.token);
        // NOTE: Since the full app structure isn't available, we'll log success instead of navigating.
        console.log("Login Successful! Navigating to /home...");
        navigate("/home");
      } else {
        // Use a custom message box instead of alert() in production
        console.error(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err.message);
      // Use a custom message box instead of alert() in production
      console.error(
        "Unable to login. Check your internet connection or server status."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleIntroContinue = () => {
    setShowIntro(false);
  };

  const MentorshipGraphic = () => (
    <svg
      className="w-64 h-64 text-white"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Abstract Background Shape (Soft Glow) */}
      <circle
        cx="100"
        cy="100"
        r="90"
        fill="url(#paint0_linear)"
        opacity="0.1"
      />

      {/* Mentor Figure (Taller, Guiding) */}
      <rect x="110" y="50" width="15" height="80" rx="7.5" fill="white" />
      <circle cx="117.5" cy="40" r="10" fill="white" />

      {/* Mentee Figure (Shorter, Learning) */}
      <rect
        x="75"
        y="70"
        width="15"
        height="60"
        rx="7.5"
        fill="white"
        opacity="0.8"
      />
      <circle cx="82.5" cy="60" r="10" fill="white" opacity="0.8" />

      {/* Guiding Arrow / Connection Path (Symbolizing growth and direction) */}
      <path
        d="M80 140 C 90 120, 110 120, 120 100"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="10 5"
      />

      {/* Small Star/Idea Burst above the mentor */}
      <polygon
        points="120,10 125,25 140,25 130,35 135,50 120,40 105,50 110,35 100,25 115,25"
        fill="#FFD700"
      />

      <defs>
        <linearGradient
          id="paint0_linear"
          x1="100"
          y1="10"
          x2="100"
          y2="190"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.5" />
          <stop offset="1" stopColor="#4C6BF2" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      {/* Abstract Background with Circles */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url(${background})`,
        }}
      >
        {/* Optional overlay for dark tint */}
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute w-40 h-40 bg-white/10 rounded-full top-[10%] left-[5%] transform scale-150 blur-3xl opacity-60"></div>
        <div className="absolute w-60 h-60 bg-white/10 rounded-full bottom-[15%] right-[10%] transform scale-125 blur-3xl opacity-60"></div>
        <div className="absolute w-20 h-20 bg-white/10 rounded-full top-[30%] right-[20%] blur-xl opacity-60"></div>
        <div className="absolute w-32 h-32 bg-white/10 rounded-full bottom-[5%] left-[20%] blur-xl opacity-60"></div>
        <div className="absolute w-52 h-52 bg-white/10 rounded-full top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 scale-125 blur-3xl opacity-60"></div>
      </div>

      <LoginHeader
        showBackButton={!showIntro}
        showTitle={showIntro} // Show title only on the intro screen
        onBackClick={() => (showIntro ? navigate("/") : setShowIntro(true))}
      />

      {showIntro ? (
        // Intro Screen (Leftmost in image)
        <motion.div
          key="intro"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex-grow flex flex-col justify-between p-8 text-white"
        >
          {/* 1. Mentor/Connection Graphic (The newly added SVG) */}
          <div className="flex justify-center items-center flex-grow pt-10">
            <MentorshipGraphic />
          </div>

          {/* 2. Text and Buttons (Aligned to the bottom) */}
          <div className="mt-auto pt-10">
            <div className="mb-8">
              <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
              <p className="text-lg text-white/80">
                Enter personal details to access your MentorSphere account.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleIntroContinue}
                className="flex-1 py-3 px-6 bg-white text-blue-600 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              >
                Sign In
              </button>
              <Link
                to="/sign"
                className="flex-1 py-3 px-6 border-2 border-white text-white font-semibold rounded-full text-center hover:bg-white/20 transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        </motion.div>
      ) : (
          
        // Login Form (Rightmost in image) - Uses minimalist header (no title)
        <motion.div
          key="login-form"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex-grow flex items-center justify-center p-4"
          >
            
          <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
              Welcome back
            </h2>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div>
                <input
                  type="email"
                  placeholder="kristin.watson@example.com" // Placeholder from image
                  required
                  className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-gray-800 transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <input
                  type="password"
                  placeholder="••••••••" // Placeholder from image
                  required
                  className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-gray-800 transition-all"
                />
              </div>

              {/* Remember me & Forgot Password */}
              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center text-gray-600">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600 rounded mr-2"
                  />
                  Remember me
                </label>
                <Link to="#" className="text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>

              {/* Sign In button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`w-full py-3 rounded-xl text-white font-semibold shadow-md ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } transition-all`}
              >
                {loading ? "Signing in..." : "Sign In"}
              </motion.button>
            </form>

            {/* Social Login Separator */}
            <div className="relative flex items-center justify-center my-8">
              <span className="absolute bg-white px-3 text-gray-500 text-sm">
                Sign in with
              </span>
              <div className="w-full border-t border-gray-200"></div>
            </div>

            {/* Social Login Buttons */}
            <div className="flex justify-center space-x-4">
              <button className="p-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                <FaFacebookF />
              </button>
              <button className="p-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                <FaTwitter />
              </button>
              <button className="p-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                <FaGoogle />
              </button>
              <button className="p-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                <FaApple />
              </button>
            </div>

            {/* Don't have an account link */}
            <p className="mt-8 text-center text-gray-600 text-sm">
              Don't have an account?{" "}
              <Link to="/sign" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};


