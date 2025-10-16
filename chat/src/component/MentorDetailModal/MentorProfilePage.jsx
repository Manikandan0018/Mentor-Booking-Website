// src/pages/MentorProfilePage.jsx
import React, { useState, useEffect } from "react";
import { Star, Linkedin, Share2, ChevronDown, Award } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Booking from "../booking/Booking";
import heroBg from "../../image/background1.png";

const MentorProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) =>
    setOpenSection(openSection === section ? null : section);

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/getMentor/${id}`
        );
        if (!res.ok) throw new Error("Failed to fetch mentor");
        const data = await res.json();
        setMentor(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMentor();
  }, [id]);

  if (!mentor)
    return <p className="text-center py-20 text-white">Loading mentor...</p>;

  return (
    <div
      className="min-h-screen relative font-sans"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Header Stats */}
      <div className="relative py-20 z-10 flex flex-wrap justify-end items-center gap-4 p-6">
        <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-300/20 to-yellow-500/10 backdrop-blur-lg px-4 py-2 rounded-xl border border-yellow-200/20 shadow">
          <Award className="text-yellow-300" />
          <span className="text-white font-medium">Top Mentor</span>
        </div>
        <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg border border-white/20 px-4 py-2 rounded-xl shadow text-center">
          <p className="font-bold text-white">{mentor.mentees || 2011}</p>
          <p className="text-xs text-gray-300">Mentee Engagements</p>
        </div>
      
      </div>

      {/* Main Section */}
      <div className="relative py-5 z-10 max-w-7xl mx-auto px-6 -mt-24 flex flex-col md:flex-row gap-8">
        {/* Left Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="md:w-1/3 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-6 text-center border border-white/20"
        >
          <img
            src={
              mentor.profileImage || `https://i.pravatar.cc/150?u=${mentor._id}`
            }
            alt={mentor.name}
            className="w-32 h-32 rounded-full mx-auto border-4 border-white shadow-lg"
          />
          <span className="inline-block mt-2 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
            Available
          </span>
          <h2 className="text-2xl font-bold mt-2 text-white">{mentor.name}</h2>
          <div className="flex justify-center items-center text-sm text-yellow-400 mt-1">
            <Star className="w-4 h-4 mr-1" /> {mentor.rating || 4.9}
          </div>
          <p className="text-gray-200 mt-1">{mentor.title}</p>
          <p className="text-sm text-gray-300">{mentor.company}</p>
          <p className="text-xs text-gray-300 mt-1">
            {mentor.experience || "4 years of Experience"}
          </p>

          <div className="mt-3 flex justify-center gap-3">
            <a
              href={mentor.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition"
            >
              <Linkedin className="w-5 h-5 text-blue-400" />
            </a>
            <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
              <Share2 className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Accordion Sections */}
          {["About", "Topics", "Skills", "Fluent in"].map((section) => (
            <div key={section} className="mt-4 border-t border-white/30">
              <button
                className="w-full flex justify-between items-center py-2 text-sm font-semibold text-white"
                onClick={() => toggleSection(section)}
              >
                {section}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openSection === section ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSection === section && (
                <p className="text-sm text-gray-200 pb-2">
                  {mentor[section.toLowerCase()] || "No details provided"}
                </p>
              )}
            </div>
          ))}
        </motion.div>

        {/* Right Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="md:w-2/3"
        >
          <h3 className="text-xl font-bold text-white mb-3">
            Available Services
          </h3>

          <div className="flex gap-4 mb-4 border-b border-white/20 pb-2 text-sm">
            {["All", "1:1 Call", "Query", "Resources"].map((tab) => (
              <button
                key={tab}
                className="px-4 py-1 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition"
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-100 mt-4 p-4 rounded-xl flex justify-between items-center backdrop-blur-md shadow-lg border border-purple-200/20">
            <span className="text-sm font-semibold">
              🎉 15% OFF on all mentor sessions with <b>Pro</b>
            </span>
            <button className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-700 transition">
              Explore Pro
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            {mentor.services?.map((service, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-lg rounded-2xl shadow-lg p-4 border border-white/20 transition"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-white">{service.name}</h4>
                  {service.badge && (
                    <span className="text-xs bg-yellow-300 text-black px-2 py-1 rounded">
                      {service.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-200 mt-2">{service.desc}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-green-400 font-bold">
                    ₹{service.discountPrice || service.price}
                    {service.discountPrice && (
                      <span className="line-through text-gray-400 ml-2">
                        ₹{service.price}
                      </span>
                    )}
                  </span>
                  <button
                    onClick={() =>
                      navigate(
                        `/mentorDateBooking/${mentor._id}?service=${service.name}`
                      )
                    }
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 text-sm transition"
                  >
                    Book Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <Booking />
        </motion.div>
      </div>
    </div>
  );
};

export default MentorProfilePage;
