import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  GraduationCap,
  Award,
  Briefcase,
  User2,
  Wallet,
  Video,
  MessageSquare,
} from "lucide-react";
import heroBg from "../../image/background1.png";
import p1 from "../../image/p1.jpg";
import p2 from "../../image/p2.jpg";

const MentorDateBooking = () => {
  const { id } = useParams();
  const location = useLocation();
  const [mentor, setMentor] = useState(null);
  const [user, setUser] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [loading, setLoading] = useState(false);

  const query = new URLSearchParams(location.search);
  const service = query.get("service");

  // Fetch logged-in user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(console.error);
  }, []);

  // Fetch mentor info
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/getMentor/${id}`)
      .then((res) => res.json())
      .then(setMentor)
      .catch(console.error);
  }, [id]);

  if (!mentor || !user)
    return (
      <p className="text-center text-gray-400 mt-20 text-lg animate-pulse">
        Loading mentor details...
      </p>
    );

  const services = [
    mentor.service_15min,
    mentor.service_chat,
    mentor.service_fulltime,
  ];
  const selectedServiceObj = services.find((s) => s?.title === service);
  if (!selectedServiceObj)
    return (
      <p className="text-center text-gray-400 mt-20">
        Invalid service selected
      </p>
    );

  const handlePayment = async () => {
    if (!bookingDate || !bookingTime)
      return alert("Please select booking date and time");

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("You must login first");

      const res = await fetch(
        "http://localhost:5000/api/payment/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            serviceTitle: selectedServiceObj.title,
            price: parseInt(selectedServiceObj.price.replace(/[^\d]/g, "")),
            mentorId: id,
            bookingDate,
            bookingTime,
          }),
        }
      );

      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Failed to create checkout session");
    } catch (err) {
      console.error(err);
      alert("Payment request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#0e0e0e] bg-cover bg-center text-gray-200 py-16 px-6 flex flex-col items-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="max-w-6xl w-full flex flex-col md:flex-row gap-10 mt-6">
        {/* Left: Mentor Info */}
        <div className="flex-1 bg-[#1a1a1a] rounded-2xl p-8 shadow-xl">
          <div className="flex items-center gap-5 mb-6">
            <img
              src={mentor.profileImage || p2}
              alt="Mentor"
              className="w-24 h-24 rounded-full object-cover border-2 "
            />
            <div>
              <h2 className="text-2xl font-bold text-white">{mentor.name}</h2>
              <p className="text-gray-400">Professional Mentor</p>
            </div>
          </div>

          <div className="space-y-3 text-gray-300">
            <p className="flex items-center gap-3">
              <GraduationCap className="text-yellow-400" />{" "}
              <span>
                <strong>Qualification:</strong> {mentor.qualification}
              </span>
            </p>
            <p className="flex items-center gap-3">
              <Award className="text-yellow-400" />{" "}
              <span>
                <strong>Experience:</strong> {mentor.experience}
              </span>
            </p>
            <p className="flex items-center gap-3">
              <Briefcase className="text-yellow-400" />{" "}
              <span>
                <strong>Skills:</strong> {mentor.skills?.join(", ")}
              </span>
            </p>
            <div className="mt-6 border-t border-gray-700 pt-4">
              <p className="flex items-center gap-3 text-lg">
                <User2 className="text-yellow-400" /> Selected Service:
                <span className="text-white font-semibold">
                  {selectedServiceObj.title}
                </span>
              </p>
              <p className="flex items-center gap-3 mt-2 text-lg">
                <Wallet className="text-yellow-400" /> Price:{" "}
                <span className="text-green-400 font-bold text-xl">
                  ₹{selectedServiceObj.price}
                </span>
              </p>
            </div>

            {/* Highlight info */}
            <div className="mt-6 flex flex-col gap-3">
              <div className="flex items-center gap-3 bg-[#252525] p-3 rounded-xl">
                <Video className="text-green-400" />
                <p className="text-sm text-gray-300">
                  Easy mentoring sessions via video call
                </p>
              </div>
              <div className="flex items-center gap-3 bg-[#252525] p-3 rounded-xl">
                <MessageSquare className="text-blue-400" />
                <p className="text-sm text-gray-300">
                  Chat with mentor anytime after booking
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Booking Form */}
        <div className="w-full md:w-[400px] bg-[#1a1a1a] rounded-2xl p-8 shadow-xl space-y-5">
          <h3 className="text-xl font-semibold text-white mb-4">
            Schedule Your Session
          </h3>

          <div>
            <label className="block text-gray-400 mb-2">Select Date:</label>
            <div className="flex items-center gap-3 bg-[#252525] rounded-lg px-3 py-2">
              <CalendarDays size={18} className="text-yellow-400" />
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="bg-transparent flex-1 text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Select Time:</label>
            <div className="flex items-center gap-3 bg-[#252525] rounded-lg px-3 py-2">
              <Clock size={18} className="text-yellow-400" />
              <input
                type="time"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="bg-transparent flex-1 text-white outline-none"
              />
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full py-3 mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition"
          >
            {loading
              ? "Processing..."
              : `Pay ₹${selectedServiceObj.price} & Book`}
          </button>
        </div>
      </div>

      
    </div>
  );
};

export default MentorDateBooking;
