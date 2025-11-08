// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

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
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://mentor-booking-website.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
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

app.use(cookieParser());
app.use(express.json());

// ------------------- ROUTES -------------------
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/chat", chatRoutes);

// ------------------- SOCKET.IO -------------------
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
    socket.room = room;
  });

  socket.on("typing", ({ mentorId, userId, senderId, isTyping }) => {
    const room = getRoomId(mentorId, userId);
    socket.to(room).emit("displayTyping", { senderId, isTyping });
  });

  // --- Voice chat signaling ---
  socket.on("offer", (data) => {
    if (socket.room) socket.to(socket.room).emit("offer", data);
  });

  socket.on("answer", (data) => {
    if (socket.room) socket.to(socket.room).emit("answer", data);
  });

  socket.on("candidate", (data) => {
    if (socket.room) socket.to(socket.room).emit("candidate", data);
  });

  socket.on("endCall", () => {
    if (socket.room) socket.to(socket.room).emit("endCall");
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
        await Chat.findOneAndUpdate(
          { mentorId: firstId, userId: secondId },
          { $push: { messages: message } },
          { new: true, upsert: true }
        );
        io.to(room).emit("receiveMessage", message);
      } catch (err) {
        console.error("💥 Chat save error:", err.message);
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

// ---------------- GET CHAT HISTORY ----------------
app.get("/api/chat/:mentorId/:userId", async (req, res) => {
  const { mentorId, userId } = req.params;
  try {
    const [firstId, secondId] = [mentorId, userId].sort();
    const chat = await Chat.findOne({
      mentorId: firstId,
      userId: secondId,
    }).populate("messages.senderId", "name profileImage");

    res.status(200).json(chat?.messages || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------- FRONTEND SERVE / 404 FIX -------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// If you deploy frontend with backend (optional)
app.use(express.static(path.join(__dirname, "client/dist")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

// ------------------- DATABASE + SERVER START -------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB Error:", err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
