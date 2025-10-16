import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    serviceTitle: String,
    bookingDate: String,
    bookingTime: String,
    paymentStatus: { type: String, default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
