import express from "express";
import { getChatMessages, sendMessageAPI } from "../controller/chat.js";

const router = express.Router();

// Get all messages between mentor and user
router.get("/:mentorId/:userId", getChatMessages);

// Optional: send message via API
router.post("/send", sendMessageAPI);

export default router;
