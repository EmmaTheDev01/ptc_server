import express from "express";
import { createPaymentRequest, getAllPaymentRequest, getPaymentRequest } from "../controllers/paymentRequest.js";

import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router()

router.post('/request', verifyUser, createPaymentRequest);
router.get('/:id', verifyUser, getPaymentRequest);
router.get('/payments', verifyAdmin, getAllPaymentRequest);

export default router;