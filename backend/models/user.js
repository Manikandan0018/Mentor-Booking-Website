// File: models/user.js (CORRECTED)

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: { type: String, enum: ["student", "mentor"], default: "student" },
    qualification: String,
    experience: String,
    skills: [String],
    profileImage: String,

    service_15min: {
      title: String,
      price: String,
      description: String,
    },
    service_chat: {
      title: String,
      price: String,
      description: String,
    },
    service_fulltime: {
      title: String,
      price: String,
      description: String,
    },

    bookedMentors: [
      {
        mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ✅ FIX 1: Add mentorName field
        mentorName: String,
        service: String,
        bookingDate: String,
        bookingTime: String,
      },
    ],

    bookedUsers: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ✅ FIX 2: Add userName field
        userName: String,
        service: String,
        bookingDate: String,
        bookingTime: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
