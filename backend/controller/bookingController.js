import Booking from "../models/Booking.js"
import User from "../models/user.js";

// Get bookings for a user by email
export const getUserBookings = async (req, res) => {
  const { userEmail } = req.params;

  try {
    const bookings = await Booking.find({ userEmail }).populate(
      "mentorId",
      "name profileImage qualification skills"
    );

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching user bookings:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

// Optional: Get bookings for a mentor (if needed)
export const getMentorBookings = async (req, res) => {
  const { mentorId } = req.params;

  try {
    const bookings = await Booking.find({ mentorId }).populate(
      "mentorId",
      "name profileImage qualification skills"
    );

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching mentor bookings:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};


export const checkBooking = async (req, res) => {
  const { mentorId, serviceTitle } = req.params;
  const studentId = req.user._id; // from auth middleware

  try {
    const existingBooking = await Booking.findOne({
      mentorId,
      studentId,
      serviceTitle,
    });

    res.json({ alreadyBooked: !!existingBooking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};