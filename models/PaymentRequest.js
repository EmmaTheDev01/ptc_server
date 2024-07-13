import mongoose from "mongoose";

const PaymentRequestSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
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
            type: mongoose.Types.Decimal128, 
            required: true,
        },
        paymentDate: {
            type: Date,
            required: true,
        },
      
    },
    { timestamps: true }
);

export default mongoose.model("PaymentRequest", PaymentRequestSchema);
