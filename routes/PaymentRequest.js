// routes/paymentRequest.js

import express from "express";
import {
    createPaymentRequest,
    getPaymentRequest,
    getAllPaymentRequests,
    getAllApprovedPaymentRequests,
    approvePaymentRequest,
    getDailyPaymentRequestCount,
} from "../controllers/paymentRequest.js";

import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/request", verifyUser, createPaymentRequest);
router.get("/:id", verifyUser, getPaymentRequest);
router.get("/", verifyAdmin, getAllPaymentRequests);
router.get("/approved", verifyAdmin, getAllApprovedPaymentRequests);
router.put("/approve/:id", verifyAdmin, approvePaymentRequest);
router.get("/daily-stats", verifyAdmin, getDailyPaymentRequestCount);

export default router;
