import React, { useState, useEffect } from "react";
import MentorCard from "../MentorCard/MentorCard.jsx";
import MentorProfilePage from "../MentorDetailModal/MentorProfilePage.jsx";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import heroBg from "../../image/background1.png"; // keep your existing background image file
import { Video, MessageSquare, UserPlus, Phone } from "lucide-react";

import mentorImg from "../../image/md.png";

const Home = () => {
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  // load current user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUser(data))
        .catch(console.error);
    }
  }, []);

  // load mentors
  useEffect(() => {
    setIsLoading(true);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/getMentor`)
      .then((res) => res.json())
      .then((data) => setMentors(data || []))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const filteredMentors = mentors.filter((m) => {
    const q = searchTerm.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q) ||
      m.company?.toLowerCase().includes(q) ||
      m.skills?.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div
      className="min-h-screen relative font-sans text-gray-900 dark:text-gray-100"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:py-0 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white drop-shadow-lg">
              <span className="inline-flex items-center">
                Build <span className="ml-3 mr-3"> </span>
                <span className="flex -space-x-2">
                  {/* small circular avatar placeholders like screenshot */}
                  <img
                    src="https://i.pravatar.cc/40?img=32"
                    alt="a"
                    className="w-9 h-9 rounded-full ring-2 ring-white"
                  />
                  <img
                    src="https://i.pravatar.cc/40?img=12"
                    alt="b"
                    className="w-9 h-9 rounded-full ring-2 ring-white"
                  />
                  <img
                    src="https://i.pravatar.cc/40?img=5"
                    alt="c"
                    className="w-9 h-9 rounded-full ring-2 ring-white"
                  />
                </span>
                <span className="ml-3">Skills</span>
              </span>
              <div>with Experts</div>
            </h1>

            <p className="max-w-xl text-gray-200">
              Find the right mentor to accelerate your personal or professional
              growth. Discover the guidance you need to thrive in your career
              and beyond.
            </p>

            {/* search bar (centered) */}
            <div className="mt-6 w-full md:w-3/4">
              <div className="flex items-center rounded-full overflow-hidden shadow-lg border border-white/20 bg-white/90 dark:bg-black/60">
                <input
                  className="flex-1 px-6 py-3 focus:outline-none text-gray-800"
                  placeholder="Search mentors, skills or company (e.g. Real Estates)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  className="px-6 py-3 bg-green-500/95 text-white font-semibold rounded-full mr-1 shadow hover:scale-[0.99] transition-transform"
                  onClick={() => {}}
                >
                  Search
                </button>
              </div>
            </div>
          </motion.div>

          <section className="min-h-screen  text-gray-200 px-6  flex flex-col md:flex-row items-center justify-center gap-10">
            {/* Left Side - Image & Floating Cards */}
            <div className="relative flex justify-center items-center w-full md:w-1/2">
              {/* Yellow background rectangle */}
              <div className="absolute inset-0 bg-[#fbbf24] rounded-3xl scale-90 md:scale-100"></div>

              {/* Mentor image */}
              <img
                src={mentorImg}
                alt="Mentor"
                className="relative z-10 mb-13 w-80 md:w-96 rounded-3xl object-cover"
              />

              {/* Floating tag - Easy Methods */}
              <div className="absolute top-10 left-0 bg-[#1a1a1a] px-4 py-3 rounded-2xl flex items-center gap-3 shadow-lg">
                <div className="bg-green-600 p-2 rounded-full">
                  <Video size={16} color="#fff" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">
                    Easy Methods
                  </p>
                  <p className="text-xs text-gray-400">
                    Available help even through video calls.
                  </p>
                </div>
              </div>

              {/* Floating tag - Available Solutions */}
              <div className="absolute top-20 right-0 bg-[#1a1a1a] px-4 py-3 rounded-2xl flex items-center gap-3 shadow-lg">
                <div className="bg-orange-500 p-2 rounded-full">
                  <MessageSquare size={16} color="#fff" />
                </div>
                <p className="font-semibold text-white text-sm">
                  Available Solutions
                </p>
              </div>

              {/* Mentor card bottom */}
              <div className="absolute -bottom-5 left-5 right-5 bg-[#1a1a1a] p-4 rounded-2xl shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={mentorImg}
                    alt="Mentor Profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-white font-semibold text-sm">
                      Allen John
                    </p>
                    <p className="text-gray-400 text-xs">UI/UX Mentor</p>
                  </div>
                </div>
                <button className="bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold px-4 py-2 rounded-xl flex items-center gap-2 transition">
                  <Phone size={16} /> Call
                </button>
              </div>
            </div>

            {/* Right Side - Text & Info */}
            <div className="w-full md:w-1/2 space-y-6">
              <h2 className="text-4xl font-bold text-white">
                Find Your Right Mentor
              </h2>
              <p className="text-gray-400 text-lg">
                Stay connected with a monthly or yearly subscription.
              </p>

              <div className="space-y-4">
                {/* Card 1 */}
                <div className="bg-[#1a1a1a] p-5 rounded-2xl flex items-start gap-4 hover:bg-[#222222] transition">
                  <div className="bg-green-600 p-3 rounded-xl">
                    <MessageSquare color="#fff" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">
                      Ring or message your mentor anytime.
                    </h4>
                    <p className="text-gray-400 text-sm">
                      We have the right mentors for any job. Connect easily and
                      grow your career.
                    </p>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-[#1a1a1a] p-5 rounded-2xl flex items-start gap-4 hover:bg-[#222222] transition">
                  <div className="bg-orange-500 p-3 rounded-xl">
                    <UserPlus color="#fff" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">
                      Become a mentor and help out people.
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Share your expertise and guide others to success in their
                      careers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* 🌟 How We Are Working Section */}
      <section className="w-full bg-gradient-to-b backdrop-blur-lg  text-center">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-fuchsia-700 mb-6">
            How <span className="text-blue-600">We Are Working</span>
          </h2>
          <p className="text-white max-w-2xl mx-auto mb-12 text-lg">
            We make mentorship simple, efficient, and meaningful. Here’s how we
            connect passionate learners with experienced mentors.
          </p>

         
        </div>
      </section>

      {/* Middle cards - Explore & Book */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-black/70 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold mb-2">
              Explore Mentorship Opportunities
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Browse categories to find a mentor tailored to your goals.
            </p>

            <div className="space-y-2">
              <details className="bg-gray-50 dark:bg-white/5 rounded-md p-3">
                <summary className="font-medium cursor-pointer">
                  Career Growth
                </summary>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  Advance your professional journey with expert guidance.
                </p>
              </details>

              <details className="bg-gray-50 dark:bg-white/5 rounded-md p-3">
                <summary className="font-medium cursor-pointer">
                  Education & Learning
                </summary>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  Upskill with mentors focused on learning and teaching.
                </p>
              </details>

              <details className="bg-gray-50 dark:bg-white/5 rounded-md p-3">
                <summary className="font-medium cursor-pointer">
                  Business & Startups
                </summary>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  Get help building your idea or scaling your business.
                </p>
              </details>
            </div>
          </div>

          <div className="bg-white dark:bg-black/70 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700 flex">
            <div className="w-2/3">
              <h3 className="text-2xl font-bold mb-2">
                Book your first free meeting
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                You will learn how the process will go and other details.
              </p>

              <button
                className="inline-block px-4 py-2 rounded-full bg-green-500 text-white font-semibold shadow"
                onClick={() => {
                  // optionally scroll to mentor grid / booking flow
                  const el = document.getElementById("mentors-grid");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Quick Tip
              </button>
            </div>

            <div className="w-1/3 flex items-center justify-end">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80&auto=format&fit=crop"
                alt="mentor"
                className="w-28 h-28 rounded-xl object-cover shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mentors Grid */}
      <main
        id="mentors-grid"
        className="max-w-7xl mx-auto px-6 py-16 relative z-10"
      >
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Top Mentors
          </h2>
          <p className="text-lg md:text-xl text-white max-w-2xl mx-auto">
            Connect with industry experts, get guidance, and level up your
            career with personalized mentorship.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search mentors..."
          className="w-full md:w-1/2 px-4 py-3 rounded-full mb-8 focus:outline-none text-gray-900"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {isLoading ? (
          <div className="text-center py-20 text-white">Loading...</div>
        ) : filteredMentors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMentors.map((mentor) => (
              <MentorCard
                key={mentor._id}
                mentor={mentor}
                onSelectMentor={setSelectedMentor}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-red-500 text-lg">No mentors found.</p>
        )}
      </main>

      {/* Mentor modal */}
      {selectedMentor && (
        <MentorProfilePage
          mentor={selectedMentor}
          onClose={() => setSelectedMentor(null)}
        />
      )}
    </div>
  );
};

export default Home;
