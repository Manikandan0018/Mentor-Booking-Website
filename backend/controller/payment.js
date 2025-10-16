// File: controllers/payment.js (FINAL CORRECTED LOGIC)

import Stripe from "stripe";
import Booking from "../models/Booking.js";
import User from "../models/user.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ------------------ Create Checkout Session ------------------
export const createCheckoutSession = async (req, res) => {
  try {
    const { mentorId, price, serviceTitle, bookingDate, bookingTime } =
      req.body;
    const userId = req.user._id;

    if (!mentorId || !price || !serviceTitle)
      return res.status(400).json({ message: "Missing booking data" });

    const mentor = await User.findById(mentorId);
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            unit_amount: price * 100,
            product_data: {
              name: `${serviceTitle} with ${mentor.name}`,
              description: `Mentorship session with ${mentor.name}`,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/booking-success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        userId: userId.toString(),
        mentorId: mentorId.toString(),
        serviceTitle,
        bookingDate,
        bookingTime,
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("createCheckoutSession error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ------------------ Stripe Webhook ------------------
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Stripe signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("✅ Webhook triggered:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { userId, mentorId, serviceTitle, bookingDate, bookingTime } =
      session.metadata || {};

    console.log("📦 Webhook metadata:", session.metadata);

    try {
      // 1. Fetch both Student and Mentor documents
      const student = await User.findById(userId);
      const mentor = await User.findById(mentorId);

      if (!student || !mentor) {
        console.error("❌ User/Mentor not found.");
        return res.status(404).json({ message: "User/Mentor not found" });
      } // 2. Create Booking record

      const newBooking = await Booking.create({
        mentorId,
        studentId: userId,
        serviceTitle,
        bookingDate,
        bookingTime,
        paymentStatus: "paid",
      });

      console.log("✅ Booking created:", newBooking._id); // 3. Update Student: PUSH Mentor's Name (uses the new schema field)

      await User.findByIdAndUpdate(userId, {
        $push: {
          bookedMentors: {
            mentorId,
            mentorName: mentor.name, // ✅ Uses new schema field
            service: serviceTitle, // Changed serviceTitle to service to match schema
            bookingDate,
            bookingTime,
          },
        },
      }); // 4. Update Mentor: PUSH Student's Name (uses the new schema field)

      await User.findByIdAndUpdate(mentorId, {
        $push: {
          bookedUsers: {
            userId,
            userName: student.name, // ✅ Uses new schema field
            service: serviceTitle, // Changed serviceTitle to service to match schema
            bookingDate,
            bookingTime,
          },
        },
      });

      console.log("🎉 Users updated successfully! Names saved.");
    } catch (err) {
      console.error("❌ Booking save error:", err);
      // Send 200 to stop Stripe retries, but log the error
      return res
        .status(200)
        .json({ received: true, error: "Database update failed" });
    }
  }

  res.json({ received: true });
};
