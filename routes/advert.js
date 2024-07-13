import express from "express";
import multer from "multer";
import {
  createAdvert,
  deleteAdvert,
  findAllAdverts,
  findAdvert,
  getFeaturedAdverts,
  getAdvertBySearch,
  getAdvertCounts,
  updateAdvert,
} from "../controllers/advert.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// Routes
router.post("/create", createAdvert);
router.put("/:id", verifyUser, updateAdvert);
router.delete("/:id", verifyAdmin, deleteAdvert);
router.get("/all-ads", verifyToken, findAllAdverts); // Fixed path should be defined before dynamic paths
router.get("/search/getAdvertBySearch", getAdvertBySearch); // Query parameter routes should come after fixed paths
router.get("/search/getFeaturedAdverts", getFeaturedAdverts);
router.get("/search/getAdvertCounts", getAdvertCounts);
router.get("/:id", findAdvert); // Dynamic path should come last

export default router;
