import express from "express";
import { createCheckoutSession } from "../controller/payment.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Only this
router.post("/create-checkout-session", protect, createCheckoutSession);

export default router;
