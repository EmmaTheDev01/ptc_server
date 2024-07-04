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
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// Routes
router.post("/create", upload.array("photo", 5), createAdvert); // Handle multiple photos
router.put("/:id", verifyAdmin, upload.single("photo"), updateAdvert); // Handle single photo
router.delete("/:id", verifyAdmin, deleteAdvert);
router.get("/:id", findAdvert);
router.get("/all-ads", findAllAdverts);
router.get("/search/getAdvertBySearch", getAdvertBySearch);
router.get("/search/getFeaturedAdverts", getFeaturedAdverts);
router.get("/search/getAdvertCounts", getAdvertCounts);

export default router;
