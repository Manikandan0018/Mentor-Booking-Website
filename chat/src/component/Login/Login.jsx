import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginHeader from "../loginHead/LoginHeader.jsx";
import { motion } from "framer-motion";
import mentorBg from "../../image/login-bg.jpg"; // Mentor-themed background

export const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

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
        navigate("/home");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err.message);
      alert(
        "Unable to login. Check your internet connection or server status."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header always on top */}
      <div className="relative z-50 w-full">
        <LoginHeader />
      </div>

      {/* Background */}
      <div
        className="relative flex items-center justify-center min-h-screen px-4 bg-gray-900"
        style={{
          backgroundImage: `url(${mentorBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Glassmorphic login card */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-md bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20 z-20"
        >
          <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-50 drop-shadow-lg">
            Welcome Back
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                required
                className="peer w-full px-5 py-3 rounded-xl border-2 border-white/50 focus:border-green-400 focus:ring-2 focus:ring-green-400 outline-none text-gray-900 bg-white/30 placeholder-transparent transition-all"
              />
              <label className="absolute left-5 -top-2 text-gray-100 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-300 peer-placeholder-shown:text-base">
                Email
              </label>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                required
                className="peer w-full px-5 py-3 rounded-xl border-2 border-white/50 focus:border-green-400 focus:ring-2 focus:ring-green-400 outline-none text-gray-900 bg-white/30 placeholder-transparent transition-all"
              />
              <label className="absolute left-5 -top-2 text-gray-100 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-300 peer-placeholder-shown:text-base">
                Password
              </label>
            </div>

            {/* Login button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full py-3 rounded-xl text-white font-semibold shadow-lg ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600"
              } transition-all`}
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>
          </form>

          {/* Sign up link */}
          <p className="mt-6 text-center text-gray-100">
            Don’t have an account?{" "}
            <Link
              to="/sign"
              className="text-green-400 font-semibold hover:text-green-300"
            >
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
};
