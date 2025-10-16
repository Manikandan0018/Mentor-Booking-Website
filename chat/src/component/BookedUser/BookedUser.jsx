import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import background from "../../image/background1.png";
import { MessageCircle, Calendar, Clock } from "lucide-react";

const BookedUsers = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setLoading(false);

      const res = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return setLoading(false);
      const data = await res.json();
      setUser(data);
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading)
    return <p className="text-center text-white mt-10 text-lg">Loading...</p>;
  if (!user)
    return (
      <p className="text-center text-white mt-10 text-lg">User not logged in</p>
    );

  const bookedUsers = user.bookedUsers || [];

  return (
    <div
      className="min-h-screen py-20 bg-cover bg-center bg-no-repeat relative flex flex-col"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-12 text-white">
        <h2 className="text-4xl font-bold mb-4 text-center">
          🌟 Your Mentorship Journey
        </h2>
        <p className="text-center max-w-2xl text-gray-200 mb-10">
          Here are the learners who have booked sessions with you. Inspire,
          guide, and help them achieve their goals. Building brighter futures
          starts here!
        </p>

        {bookedUsers.length === 0 ? (
          <p className="text-center text-gray-300 text-lg">
            No users have booked a session yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
            {bookedUsers.map((booking) => (
              <div
                key={booking._id}
                onClick={() =>
                  navigate("/chat", {
                    state: {
                      mentorId: booking.userId?._id,
                      mentorName: booking.userId?.name,
                      mentorImage: booking.userId?.profileImage,
                      userId: user._id,
                    },
                  })
                }
                className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={booking.userId?.profileImage || "/default-avatar.png"}
                    alt={booking.userId?.name || "User"}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
                  />
                  <div>
                    <p className="font-semibold text-xl text-white">
                      {booking.userId?.name || "Unknown User"}
                    </p>
                    <p className="text-sm text-gray-300">Aspiring Learner</p>
                  </div>
                </div>

                <div className="space-y-2 text-gray-200">
                  <p className="flex items-center gap-2">
                    <Calendar size={18} /> <span>{booking.bookingDate}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={18} /> <span>{booking.bookingTime}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MessageCircle size={18} />{" "}
                    <span>Service: {booking.service}</span>
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/chat", {
                      state: {
                        mentorId: booking.userId?._id,
                        mentorName: booking.userId?.name,
                        mentorImage: booking.userId?.profileImage,
                        userId: user._id,
                      },
                    });
                  }}
                  className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-all"
                >
                  Message {booking.userId?.name?.split(" ")[0] || "User"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookedUsers;
