import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginHeader from "../loginHead/LoginHeader";
import mentorBg from "../../image/login-bg.jpg"; // Mentor-themed background
import { motion } from "framer-motion";

export const Signup = () => {
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();

      // append all form data
      for (let key in formData) {
        data.append(key, formData[key]);
      }

      data.append("role", role);
      if (file) data.append("profileImage", file);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`,
        {
          method: "POST",
          body: data,
        }
      );


      const result = await res.json();
      if (res.ok) {
        alert("Signup successful!");
        navigate("/");
      } else {
        alert(result.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup fetch error:", err);
      alert("Server error");
    }
  };

  return (
    <>
      <div className="relative z-50 w-full">
        <LoginHeader />
      </div>
      <div
        className="relative flex items-center justify-center min-h-screen px-4 bg-gray-900"
        style={{
          backgroundImage: `url(${mentorBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-md bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20 z-20"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Signup</h2>

          {!role ? (
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setRole("student")}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                I am Student
              </button>
              <button
                onClick={() => setRole("mentor")}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                I am Mentor
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="file"
                name="profileImage"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border rounded-lg"
              />

              {role === "mentor" && (
                <>
                  <input
                    type="text"
                    name="qualification"
                    placeholder="Qualification"
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    name="skills"
                    placeholder="Skills (comma separated)"
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    name="company"
                    placeholder="Current Company"
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    name="experience"
                    placeholder="Experience (e.g., 3 years)"
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />

                  <div className="mt-4 space-y-3">
                    <h3 className="text-lg font-semibold">Service Pricing</h3>

                    <div className="flex flex-col gap-2">
                      <label>15-min Call (e.g., FREE or ₹50)</label>
                      <input
                        type="text"
                        name="service_15min_price"
                        placeholder="Price for 15-min Call"
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label>1-to-1 Chat (e.g., ₹50)</label>
                      <input
                        type="text"
                        name="service_chat_price"
                        placeholder="Price for Chat"
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label>Full-time Call (e.g., ₹100)</label>
                      <input
                        type="text"
                        name="service_fulltime_price"
                        placeholder="Price for Full-time Call"
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                </>
              )}

              {role === "student" && (
                <>
                  <input
                    type="text"
                    name="mentorType"
                    placeholder="Type of mentor you want?"
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    name="skills"
                    placeholder="Your Skills (comma separated)"
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    name="study"
                    placeholder="Currently Studying (e.g., B.Tech CSE)"
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg mt-4 transition"
              >
                Signup as {role}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </>
  );
};
