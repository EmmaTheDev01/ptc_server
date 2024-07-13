import mongoose from 'mongoose';
import PaymentRequest from '../models/PaymentRequest.js';

// Create a payment request
export const createPaymentRequest = async (req, res) => {
  const { fullName, userEmail, phone, amount, userId } = req.body;

  // Ensure amount is a valid number
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid amount. Amount must be a valid number greater than 0.",
    });
  }

  try {
    // Convert userId to ObjectId
    const objectIdUserId = mongoose.Types.ObjectId(userId);

    const newPaymentRequest = new PaymentRequest({
      userId: objectIdUserId, // Use ObjectId for userId
      fullName,
      userEmail,
      phone,
      amount: parsedAmount,
      approved: false,
    });

    const savedPaymentRequest = await newPaymentRequest.save();

    res.status(200).json({
      success: true,
      message: 'Payment request successful',
      data: savedPaymentRequest,
    });
  } catch (err) {
    console.error("Error saving payment request:", err);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment request',
      error: err.message,
    });
  }
};

// Get a specific payment request by ID
export const getPaymentRequest = async (req, res) => {
  const id = req.params._id;
  try {
    const paymentRequest = await PaymentRequest.findById(id);
    if (!paymentRequest) {
      return res.status(404).json({
        success: false,
        message: "Payment request not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Payment request details",
      data: paymentRequest,
    });
  } catch (err) {
    console.error("Error fetching payment request details:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment request details",
      error: err.message,
    });
  }
};

// Get all payment requests
export const getAllPaymentRequests = async (req, res) => {
  try {
    const allPaymentRequests = await PaymentRequest.find();
    res.status(200).json({
      success: true,
      message: "All payment requests",
      data: allPaymentRequests,
    });
  } catch (err) {
    console.error("Error fetching all payment requests:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch all payment requests",
      error: err.message,
    });
  }
};

// Get all approved payment requests
export const getAllApprovedPaymentRequests = async (req, res) => {
  try {
    const approvedPaymentRequests = await PaymentRequest.find({ approved: true });
    res.status(200).json({
      success: true,
      message: "Approved payment requests",
      data: approvedPaymentRequests,
    });
  } catch (err) {
    console.error("Error fetching approved payment requests:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch approved payment requests",
      error: err.message,
    });
  }
};


// Set a payment request to approved
export const approvePaymentRequest = async (req, res) => {
  const id = req.params.id; // Corrected to req.params.id
  
  try {
    const paymentRequest = await PaymentRequest.findByIdAndUpdate(
      id,
      { approved: true },
      { new: true } // To return the updated document
    );

    if (!paymentRequest) {
      return res.status(404).json({
        success: false,
        message: "Payment request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment request approved",
      data: paymentRequest,
    });
  } catch (err) {
    console.error("Error approving payment request:", err);
    res.status(500).json({
      success: false,
      message: "Failed to approve payment request",
      error: err.message,
    });
  }
};