// routes/paymentRequest.js

import express from "express";
import {
    createPaymentRequest,
    getPaymentRequest,
    getAllPaymentRequests,
    getAllApprovedPaymentRequests,
    approvePaymentRequest,
    getDailyPaymentCount,
} from "../controllers/paymentRequest.js";

import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/request", verifyUser, createPaymentRequest);
router.get("/:id", verifyUser, getPaymentRequest);
router.get("/", verifyAdmin, getAllPaymentRequests);
router.get("/approved", verifyAdmin, getAllApprovedPaymentRequests);
router.put("/approve/:id", verifyAdmin, approvePaymentRequest);
router.get("/daily-payment-count", verifyAdmin, getDailyPaymentCount);

export default router;
