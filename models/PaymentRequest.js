import mongoose from "mongoose";

const PaymentRequestSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        userEmail: {
            type: String,
            required: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        approved: {
            type: Boolean,
            default: false,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
      
    },
    { timestamps: true }
);

export default mongoose.model("PaymentRequest", PaymentRequestSchema);
