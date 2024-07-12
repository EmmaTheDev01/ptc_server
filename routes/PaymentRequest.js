import express from "express";
import { createPaymentRequest, getAllPaymentRequest, getPaymentRequest,getAllApprovedPaymentRequests } from "../controllers/paymentRequest.js";

import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router()

router.post('/request', verifyUser, createPaymentRequest);
router.get('/:id', verifyUser, getPaymentRequest);
router.get('/', verifyAdmin, getAllPaymentRequest);
router.get('/approved',verifyAdmin, getAllApprovedPaymentRequests);


export default router;