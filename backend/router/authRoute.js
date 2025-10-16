import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMentor,
  getMentorById,
  getUserById,
  getCurrentUser,
} from "../controller/authController.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // ✅ already v2
  params: {
    folder: "mentorship_profiles",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const parser = multer({ storage });

router.post("/signup", parser.single("profileImage"), registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/getMentor", getMentor);
router.get("/getMentor/:id", getMentorById);
router.get("/getUser/:id", getUserById);
router.get("/me", protect, getCurrentUser);


export default router;
