import mongoose from "mongoose";

const PaymentRequestSchema = new mongoose.Schema(
    {
        userId: {
            type: String,

        },
        userEmail: {
            type: String,
            required: true,

        },
        fullName: {
            type: String,
            required: true,
        },
        AdvertTitle: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },

        paymentDate: {
            type: Date,
            required: true,

        },
        PaymentStatus: {
            type: Date,
            required: true,

        },
    },
    { timestamps: true }
);

export default mongoose.model("PaymentRequest", PaymentRequestSchema);
