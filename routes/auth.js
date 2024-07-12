import express from "express";
import { login, register, getProfile } from "../controllers/authController.js";
import { verifyToken,  } from "../utils/verifyToken.js";
const router = express.Router()

router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyToken, getProfile);

export default router;
