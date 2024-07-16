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
  startAdView,
  confirmAdView,
  cancelAdView,
} from "../controllers/advert.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// Routes
router.post("/create", createAdvert);
router.put("/:id", verifyUser, updateAdvert);
router.delete("/:id", verifyAdmin, deleteAdvert);
router.get("/all-ads", verifyUser, findAllAdverts); // Fixed path should be defined before dynamic paths
router.get("/search/getAdvertBySearch", getAdvertBySearch); // Query parameter routes should come after fixed paths
router.get("/search/getFeaturedAdverts", getFeaturedAdverts);
router.get("/search/getAdvertCounts", getAdvertCounts);
router.get("/:id", findAdvert); // Dynamic path should come last
// New Routes for Ad Viewing and Rewards
router.post("/start", verifyUser, startAdView); // Start tracking ad view
router.post("/confirm", verifyUser, confirmAdView); // Confirm ad view and process reward
router.post("/cancel", verifyUser, cancelAdView); // Cancel ad view and reject reward


export default router;
