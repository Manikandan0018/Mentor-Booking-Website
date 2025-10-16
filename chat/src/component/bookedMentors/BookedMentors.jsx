import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MessageCircle, Star, Award } from "lucide-react";
import heroBg from "../../image/background1.png";




const BookedMentors = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return setLoading(false);

        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          console.error("Failed to fetch user:", res.status);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading)
    return <p className="text-center text-white mt-10 text-lg">Loading...</p>;
  if (!user)
    return (
      <p className="text-center text-white mt-10 text-lg">User not logged in</p>
    );

  // ✅ Remove duplicate bookings
  const uniqueBookings = Array.from(
    new Map(
      (user.bookedMentors || []).map((b) => [
        `${b.mentorId}_${b.service}_${b.bookingDate}_${b.bookingTime}`,
        b,
      ])
    ).values()
  );

  return (
    <div
      className="min-h-screen py-15 bg-cover bg-center bg-no-repeat relative flex flex-col"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-12 text-white">
        <h2 className="text-4xl font-bold mb-4 text-center">
          🎯 Your Booked Mentors
        </h2>
        <p className="text-center max-w-2xl text-gray-200 mb-10">
          Connect with the mentors who will guide your journey. Learn from their
          expertise, gain new perspectives, and unlock your full potential.
        </p>

        {uniqueBookings.length === 0 ? (
          <p className="text-center text-gray-300 text-lg">
            You haven’t booked any mentors yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
            {uniqueBookings.map((mentorObj, index) => {
              const mentor = mentorObj?.mentorId;
              if (!mentor) return null;

              return (
                <div
                  key={mentorObj._id || index}
                  className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  {/* Top section */}
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={mentor.profileImage || "/default-avatar.png"}
                      alt={mentor.name || "Mentor"}
                      className="w-24 h-24 rounded-full object-cover border-2 border-white/30 shadow-md mb-4"
                    />
                    <h3 className="text-xl font-semibold text-white">
                      {mentor.name || "Unknown Mentor"}
                    </h3>
                    <p className="text-sm text-gray-300 mt-1">
                      {mentor.qualification || "Mentorship Expert"}
                    </p>
                    
                  </div>

                  {/* Booking Details */}
                  <div className="mt-5 text-gray-200 space-y-2">
                    <p className="flex items-center gap-2">
                      <Calendar size={18} />{" "}
                      <span>Date: {mentorObj.bookingDate || "N/A"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock size={18} />{" "}
                      <span>Time: {mentorObj.bookingTime || "N/A"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Award size={18} />{" "}
                      <span>Service: {mentorObj.service || "General"}</span>
                    </p>
                  </div>

                  {/* Reviews / Experience Badges */}
                  <div className="flex justify-around mt-5">
                    <div className="bg-indigo-100 text-indigo-700 rounded-full px-3 py-1 text-sm font-semibold">
                      {mentor.experience || "5+"} yrs Exp
                    </div>
                    <div className="bg-pink-100 text-pink-600 rounded-full px-3 py-1 text-sm font-semibold">
                      ⭐ {Math.floor(Math.random() * 50 + 10)} Reviews
                    </div>
                  </div>

                  {/* Message Button */}
                  <button
                    onClick={() =>
                      navigate("/chat", {
                        state: {
                          mentorId: mentor._id,
                          mentorName: mentor.name,
                          mentorImage: mentor.profileImage,
                          userId: user._id,
                        },
                      })
                    }
                    className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={18} />
                    Message {mentor.name?.split(" ")[0] || "Mentor"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookedMentors;
