import express from "express";
import { login, register, getProfile, forgotPassword, resetPassword } from "../controllers/authController.js";
import { verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyUser, getProfile);

// Route to initiate password reset
router.post("/forgot-password", forgotPassword);

// Route to handle password reset
router.post("/reset-password", resetPassword);

export default router;
