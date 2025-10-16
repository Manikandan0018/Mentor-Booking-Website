import React from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const gradientColors = [
  { top: "from-pink-200 to-pink-100", badge: "bg-pink-700" },
  { top: "from-blue-200 to-blue-100", badge: "bg-blue-700" },
  { top: "from-purple-200 to-purple-100", badge: "bg-purple-700" },
  { top: "from-yellow-200 to-yellow-100", badge: "bg-yellow-700" },
];

const getGradient = (id) => {
  const hash =
    id?.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) || 0;
  return gradientColors[hash % gradientColors.length];
};

const MentorCard = ({ mentor, dark }) => {
  const navigate = useNavigate();
  const {
    _id,
    name,
    qualification,
    profileImage,
    skills,
    experience,
  } = mentor;
  const rating = mentor.rating || (4.5 + Math.random() * 0.4).toFixed(1);
  const color = getGradient(_id);

  return (
    <div
      className={`w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden`}
      onClick={() => navigate(`/mentor/${_id}`)}
    >
      {/* Top gradient strip */}
      <div className={`relative h-28 bg-gradient-to-r ${color.top}`}>
        {/* Available Badge */}
        <div
          className={`absolute top-3 left-3 text-xs font-semibold text-white px-2 py-1 rounded-full ${color.badge} shadow`}
        >
          Available
        </div>

        {/* Trophy Icon */}
        <div className="absolute top-3 right-3">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2583/2583343.png"
            alt="trophy"
            className="w-5 h-5"
          />
        </div>

        {/* Profile Image */}
        <div className="absolute left-1/2 -bottom-10 transform -translate-x-1/2">
          <img
            src={profileImage || `https://i.pravatar.cc/150?u=${_id}`}
            alt={name}
            className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-md"
            onError={(e) => {
              e.target.src =
                "https://placehold.co/100x100/34D399/white?text=User";
            }}
          />
        </div>
      </div>

      {/* Body */}
      <div className="pt-14 pb-6 px-4 text-center">
        {/* Rating */}
        <div className="flex items-center justify-center mb-2 text-sm font-semibold text-gray-700">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
          {rating}
        </div>

        {/* Name */}
        <h3 className="text-lg font-bold text-gray-900">{name}</h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
         Qualification : {qualification || "Professional"}
        </p>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          Skills : {skills || "Professional"} 
        </p>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
         experience : {experience} years
        </p>

        {/* Button */}
        <button className="mt-4 px-4 py-2 rounded-full border border-gray-300 text-gray-800 text-sm font-medium hover:bg-gray-100 transition-all duration-200">
          View Profile
        </button>
      </div>
    </div>
  );
};

export default MentorCard;
