import express from "express";
import { createPaymentRequest, getAllPaymentRequest, getPaymentRequest } from "../controllers/paymentRequest.js";

import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router()

router.post('/', verifyUser, createPaymentRequest);
router.get('/:id', verifyUser, getPaymentRequest);
router.get('/', verifyAdmin, getAllPaymentRequest);

export default router;