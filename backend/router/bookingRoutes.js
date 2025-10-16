import express from "express";
import {
  getUserBookings,
  getMentorBookings,
  checkBooking,
} from "../controller/bookingController.js";
import { protect } from "../middleware/authMiddleware.js"; // your JWT auth

const router = express.Router();

// Get bookings for a user by email
router.get("/user-bookings/:userEmail", getUserBookings);

// Optional: Get bookings for a mentor by mentorId
router.get("/mentor-bookings/:mentorId", getMentorBookings);

router.get("/check/:mentorId/:serviceTitle", protect, checkBooking);

export default router;
