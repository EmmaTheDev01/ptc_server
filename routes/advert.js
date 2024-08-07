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
  getApprovedAdverts,
  approveAdvert,
  disapproveAdvert,
} from "../controllers/advert.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// Routes
router.post("/create", createAdvert);
router.put("/:id", verifyAdmin, updateAdvert);
router.delete("/:id", verifyAdmin, deleteAdvert);
router.get("/all-ads", verifyAdmin, findAllAdverts); 
router.get('/approved-ads', verifyUser, getApprovedAdverts);
router.put("/approve/:id", verifyAdmin, approveAdvert);
router.put("/disapprove/:id", verifyAdmin, disapproveAdvert);
router.get("/search/getAdvertBySearch", getAdvertBySearch); 
router.get("/search/getAdvertCounts", getAdvertCounts);
router.get("/:id", findAdvert); // Dynamic path should come last
// New Routes for Ad Viewing and Rewards
router.post("/start", verifyUser, startAdView); // Start tracking ad view
router.post("/confirm", verifyUser, confirmAdView); // Confirm ad view and process reward
router.post("/cancel", verifyUser, cancelAdView); // Cancel ad view and reject reward


export default router;
