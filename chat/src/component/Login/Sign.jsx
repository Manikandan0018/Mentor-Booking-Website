import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import LoginHeader from "../loginHead/LoginHeader";
import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaGoogle, FaApple } from "react-icons/fa";
import Header from "../header/Header";
import background from "../../image/background1.png";
export const Signup = () => {
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreedToTerms) {
      alert("You must agree to the processing of personal data.");
      return;
    }

    try {
      const data = new FormData();
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

  const inputStyle =
    "w-full px-5 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-gray-800 transition-all";
  const labelStyle =
    "absolute left-5 -top-2 text-blue-600 text-xs font-medium transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base";

  return (
    <>
      <div className="relative min-h-screen overflow-hidden flex flex-col">
        {/* Background */}

        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: `url(${background})`,
          }}
        >
          {/* Optional overlay for dark tint */}
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="absolute w-40 h-40 bg-white/10 rounded-full top-[10%] left-[5%] blur-3xl opacity-60"></div>
          <div className="absolute w-60 h-60 bg-white/10 rounded-full bottom-[15%] right-[10%] blur-3xl opacity-60"></div>
          <div className="absolute w-20 h-20 bg-white/10 rounded-full top-[30%] right-[20%] blur-xl opacity-60"></div>
          <div className="absolute w-32 h-32 bg-white/10 rounded-full bottom-[5%] left-[20%] blur-xl opacity-60"></div>
          <div className="absolute w-52 h-52 bg-white/10 rounded-full top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-60"></div>
        </div>

        {/* Header */}
        <LoginHeader
          showBackButton={true}
          onBackClick={() => (role ? setRole("") : navigate("/"))}
        />

        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex-grow flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
              {role
                ? `Signup as ${role.charAt(0).toUpperCase() + role.slice(1)}`
                : "Get Started"}
            </h2>

            {/* Role Selection */}
            {!role ? (
              <div className="flex flex-col gap-4 justify-center">
                <p className="text-center text-gray-600 mb-4">
                  Choose your path to MentorSphere!
                </p>
                <button
                  onClick={() => setRole("student")}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-md"
                >
                  I am a Student 
                </button>
                <button
                  onClick={() => setRole("mentor")}
                  className="px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors shadow-md"
                >
                  I am a Mentor 
                </button>
              </div>
            ) : (
              <>
                {/* Signup Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      onChange={handleChange}
                      className={`${inputStyle} peer`}
                      required
                    />
                    <label className={labelStyle}>Full Name</label>
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      onChange={handleChange}
                      className={`${inputStyle} peer`}
                      required
                    />
                    <label className={labelStyle}>Email</label>
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      placeholder="Password "
                      onChange={handleChange}
                      className={`${inputStyle} peer`}
                      required
                    />
                    <label className={labelStyle}>Password</label>
                  </div>

                  {/* Profile Image */}
                  <div className="relative">
                    <label className="block text-gray-600 text-sm font-medium mb-1">
                      Profile Image (Optional)
                    </label>
                    <input
                      type="file"
                      name="profileImage"
                      onChange={handleFileChange}
                      className="w-full text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition-all"
                    />
                  </div>

                  {/* Checkbox */}
                  <div className="flex items-center text-sm mt-4">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="form-checkbox h-4 w-4 text-blue-600 rounded mr-2"
                      required
                    />
                    <label className="text-gray-600">
                      I agree to the processing of{" "}
                      <Link to="#" className="text-blue-600 hover:underline">
                        Personal data
                      </Link>
                    </label>
                  </div>

                  {/* Mentor Fields */}
                  {role === "mentor" && (
                    <div className="space-y-4 pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800">
                        Mentor Details
                      </h3>
                      <input
                        type="text"
                        name="qualification"
                        placeholder="Qualification"
                        onChange={handleChange}
                        className={inputStyle}
                      />
                      <input
                        type="text"
                        name="skills"
                        placeholder="Skills (comma separated)"
                        onChange={handleChange}
                        className={inputStyle}
                      />
                      <input
                        type="text"
                        name="company"
                        placeholder="Current Company"
                        onChange={handleChange}
                        className={inputStyle}
                      />
                      <input
                        type="text"
                        name="experience"
                        placeholder="Experience (e.g., 3 years)"
                        onChange={handleChange}
                        className={inputStyle}
                      />
                      <h4 className="text-md font-semibold text-gray-700 pt-4 border-t border-gray-200">
                        Service Pricing
                      </h4>
                      <input
                        type="text"
                        name="service_15min_price"
                        placeholder="15-min Call Price (e.g., FREE or ₹50)"
                        onChange={handleChange}
                        className={inputStyle}
                      />
                      <input
                        type="text"
                        name="service_chat_price"
                        placeholder="1-to-1 Chat Price (e.g., ₹50)"
                        onChange={handleChange}
                        className={inputStyle}
                      />
                      <input
                        type="text"
                        name="service_fulltime_price"
                        placeholder="Full-time Call Price (e.g., ₹100)"
                        onChange={handleChange}
                        className={inputStyle}
                      />
                    </div>
                  )}

                  {/* Student Fields */}
                  {role === "student" && (
                    <div className="space-y-4 pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800">
                        Student Interests
                      </h3>
                      <input
                        type="text"
                        name="mentorType"
                        placeholder="Type of mentor you want?"
                        onChange={handleChange}
                        className={inputStyle}
                      />
                      <input
                        type="text"
                        name="skills"
                        placeholder="Your Skills (comma separated)"
                        onChange={handleChange}
                        className={inputStyle}
                      />
                      <input
                        type="text"
                        name="study"
                        placeholder="Currently Studying (e.g., B.Tech CSE)"
                        onChange={handleChange}
                        className={inputStyle}
                      />
                    </div>
                  )}

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-colors mt-6"
                  >
                    Sign up
                  </motion.button>
                </form>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-8">
                  <span className="absolute bg-white px-3 text-gray-500 text-sm">
                    Sign up with
                  </span>
                  <div className="w-full border-t border-gray-200"></div>
                </div>

                {/* Social Buttons */}
                <div className="flex justify-center space-x-4">
                  <button className="p-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                    <FaFacebookF className="text-gray-600 w-5 h-5" />
                  </button>
                  <button className="p-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                    <FaTwitter className="text-gray-600 w-5 h-5" />
                  </button>
                  <button className="p-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                    <FaGoogle className="text-gray-600 w-5 h-5" />
                  </button>
                  <button className="p-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                    <FaApple className="text-gray-600 w-5 h-5" />
                  </button>
                </div>

                {/* Already have account */}
                <p className="mt-8 text-center text-gray-600 text-sm">
                  Already have an account?{" "}
                  <Link to="/" className="text-blue-600 hover:underline">
                    Sign In
                  </Link>
                </p>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};
