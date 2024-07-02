import express from "express";
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
//create a new Advert
router.post("/create", verifyAdmin, createAdvert);
//update a Advert
router.put("/:id", verifyAdmin, updateAdvert);
//delete a Advert
router.delete("/:id", verifyAdmin, deleteAdvert);
//find a Advert
router.get("/:id", findAdvert);
//find  all Adverts
router.get("/all-ads", findAllAdverts);
//Search Adverts
router.get("/search/getAdvertBySearch", getAdvertBySearch);
router.get("/search/getFeaturedAdverts", getFeaturedAdverts);
router.get("/search/getAdvertCounts", getAdvertCounts);
export default router;
