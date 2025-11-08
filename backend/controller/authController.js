// controller/authController.js
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js"; // if used

// Generate JWT token
const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ===================== SIGNUP =====================
export const registerUser = async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const {
      name,
      email,
      password,
      role,
      qualification,
      skills,
      company,
      experience,
      mentorType,
      study,
      service_15min_price,
      service_chat_price,
      service_fulltime_price,
    } = req.body;

    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      profileImage: req.file?.path || "",

      ...(role === "mentor" && {
        qualification,
        skills: skills?.split(",").map((s) => s.trim()),
        company,
        experience,
        service_15min: {
          title: "15-min Call",
          price: service_15min_price || "FREE",
          description: "Short mentorship call",
        },
        service_chat: {
          title: "1-to-1 Chat",
          price: service_chat_price || "₹50",
          description: "Private mentorship chat",
        },
        service_fulltime: {
          title: "Full-time Call",
          price: service_fulltime_price || "₹100",
          description: "Full mentorship session",
        },
      }),

      ...(role === "student" && {
        mentorType,
        skills: skills?.split(",").map((s) => s.trim()),
        study,
      }),
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      token: generateToken(newUser._id),
      user: {
        _id: newUser._id,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== LOGIN =====================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== GET CURRENT USER (/me) =====================
export const getCurrentUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      } else {
        return res.status(401).json({ message: "Invalid token" });
      }
    }

    const user = await User.findById(decoded.id).populate(
      "bookedMentors.mentorId bookedUsers.userId"
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Get current user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ===================== GET ALL MENTORS =====================
export const getMentor = async (req, res) => {
  try {
    const mentors = await User.find({ role: "mentor" }); // fetch only mentors
    res.status(200).json(mentors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch mentors" });
  }
};

// ===================== GET MENTOR BY ID =====================
export const getMentorById = async (req, res) => {
  try {
    const { id } = req.params;
    const mentor = await User.findById(id);
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });
    res.status(200).json(mentor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch mentor" });
  }
};

// ===================== GET USER BY ID =====================
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "bookedMentors.mentorId"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== LOGOUT =====================
export const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

