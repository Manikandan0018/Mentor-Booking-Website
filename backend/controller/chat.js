import Chat from "../models/chat.js";
import mongoose from "mongoose";

// ✅ Get or create one chat for both users
export const getChatMessages = async (req, res) => {
  const { mentorId, userId } = req.params;

  try {
    const chat = await Chat.findOne({
      $or: [
        {
          mentorId: new mongoose.Types.ObjectId(mentorId),
          userId: new mongoose.Types.ObjectId(userId),
        },
        {
          mentorId: new mongoose.Types.ObjectId(userId),
          userId: new mongoose.Types.ObjectId(mentorId),
        },
      ],
    });

    res.status(200).json(chat?.messages || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Send message and ensure both users share one chat document
export const sendMessageAPI = async (req, res) => {
  const { mentorId, userId, senderId, text, type, voiceUrl } = req.body;

  if (!mentorId || !userId || !senderId)
    return res.status(400).json({ message: "Missing fields" });

  const message = {
    senderId,
    text,
    type: type || "text",
    voiceUrl: voiceUrl || null,
    createdAt: new Date(),
  };

  try {
    // 🔑 Use $or to find existing chat in either direction
    const chat = await Chat.findOneAndUpdate(
      {
        $or: [
          {
            mentorId: new mongoose.Types.ObjectId(mentorId),
            userId: new mongoose.Types.ObjectId(userId),
          },
          {
            mentorId: new mongoose.Types.ObjectId(userId),
            userId: new mongoose.Types.ObjectId(mentorId),
          },
        ],
      },
      { $push: { messages: message } },
      { new: true, upsert: true }
    );

    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
