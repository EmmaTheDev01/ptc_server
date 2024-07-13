// paymentRequest.js

import PaymentRequest from "../models/PaymentRequest.js";

export const createPaymentRequest = async (req, res) => {
    const { fullName, userEmail, phone, amount } = req.body;

    try {
        const newPaymentRequest = new PaymentRequest({
            fullName,
            userEmail,
            phone,
            amount,
            paymentDate: new Date(), // Assuming paymentDate should be set automatically
            approved: false, // Assuming initially all requests are not approved
        });

        const savedPaymentRequest = await newPaymentRequest.save();
        
        res.status(200).json({
            success: true,
            message: 'PaymentRequest successful',
            data: savedPaymentRequest,
        });
    } catch (err) {
        console.error("Error saving payment request:", err);
        res.status(500).json({
            success: false,
            message: 'PaymentRequest failed',
        });
    }
};

export const getPaymentRequest = async (req, res) => {
    const id = req.params.id;
    try {
        const paymentRequest = await PaymentRequest.findById(id);
        if (!paymentRequest) {
            return res.status(404).json({
                success: false,
                message: "PaymentRequest not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "PaymentRequest details",
            data: paymentRequest,
        });
    } catch (err) {
        console.error("Error fetching payment request details:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch payment request details",
        });
    }
};

export const getAllPaymentRequest = async (req, res) => {
    try {
        const allPaymentRequest = await PaymentRequest.find();
        res.status(200).json({
            success: true,
            message: "PaymentRequest details",
            data: allPaymentRequest,
        });
    } catch (err) {
        console.error("Error fetching all payment requests:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch all payment requests",
        });
    }
};

export const getAllApprovedPaymentRequests = async (req, res) => {
    try {
        const approvedPaymentRequests = await PaymentRequest.find({
            approved: true,
        });
        res.status(200).json({
            success: true,
            message: "Approved PaymentRequests details",
            data: approvedPaymentRequests,
        });
    } catch (err) {
        console.error("Error fetching approved payment requests:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch approved payment requests",
        });
    }
};
