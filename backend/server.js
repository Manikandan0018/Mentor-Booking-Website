// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

import authRoutes from "./router/authRoute.js";
import paymentRoutes from "./router/payment.js";
import bookingRoutes from "./router/bookingRoutes.js";
import chatRoutes from "./router/chat.js";
import { stripeWebhook } from "./controller/payment.js";
import Chat from "./models/chat.js";

dotenv.config();
const app = express();
const server = http.createServer(app);



// ------------------- MIDDLEWARE -------------------
// ------------------- MIDDLEWARE -------------------
const allowedOrigins = [
  "http://localhost:5173", 
  "https://mentor-booking-website.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS not allowed by server"));
    },
    credentials: true,
  })
);

// Stripe webhook must come BEFORE express.json()
app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// JSON & cookie parsers for all other routes
app.use(cookieParser());
app.use(express.json());

// ------------------- ROUTES -------------------
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes); // /webhook already handled
app.use("/api/booking", bookingRoutes);
app.use("/api/chat", chatRoutes);

// ------------------- SOCKET.IO -------------------

// ---------------- SOCKET.IO ----------------
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let onlineUsers = {}; // { userId: socketId }

const getRoomId = (mentorId, userId) => [mentorId, userId].sort().join("-");

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("userOnline", (userId) => {
    onlineUsers[userId] = socket.id;
    io.emit("updateOnlineStatus", onlineUsers);
  });

  socket.on("joinRoom", ({ mentorId, userId }) => {
    const room = getRoomId(mentorId, userId);
    socket.join(room);
  });

  socket.on("typing", ({ mentorId, userId, senderId, isTyping }) => {
    const room = getRoomId(mentorId, userId);
    socket.to(room).emit("displayTyping", { senderId, isTyping });
  });
  // --- Voice chat signaling ---
  socket.on("offer", (data) => {
    socket.to(socket.room).emit("offer", data);
  });

  socket.on("answer", (data) => {
    socket.to(socket.room).emit("answer", data);
  });

  socket.on("candidate", (data) => {
    socket.to(socket.room).emit("candidate", data);
  });

  socket.on("endCall", () => {
    socket.to(socket.room).emit("endCall");
  });

  socket.on(
    "sendMessage",
    async ({ mentorId, userId, senderId, text, type, voiceUrl }) => {
      if (!mentorId || !userId || !senderId) return;
      const room = getRoomId(mentorId, userId);

      const message = {
        senderId,
        text,
        type: type || "text",
        voiceUrl,
        createdAt: new Date(),
      };

      try {
        const [firstId, secondId] = [mentorId, userId].sort();
        const chat = await Chat.findOneAndUpdate(
          { mentorId: firstId, userId: secondId },
          { $push: { messages: message } },
          { new: true, upsert: true }
        );
        io.to(room).emit("receiveMessage", message);
      } catch (err) {
        console.error(err.message);
      }
    }
  );

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    for (let uid in onlineUsers) {
      if (onlineUsers[uid] === socket.id) delete onlineUsers[uid];
    }
    io.emit("updateOnlineStatus", onlineUsers);
  });
});

// ---------------- ROUTES ----------------
app.get("/api/chat/:mentorId/:userId", async (req, res) => {
  const { mentorId, userId } = req.params;
  try {
    const [firstId, secondId] = [mentorId, userId].sort();
    const chat = await Chat.findOne({ mentorId: firstId, userId: secondId }).populate("messages.senderId", "name profileImage");
    res.status(200).json(chat?.messages || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ------------------- DATABASE + SERVER START -------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB Error:", err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

