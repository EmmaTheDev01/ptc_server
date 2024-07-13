import mongoose from 'mongoose';

const PaymentRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.model('PaymentRequest', PaymentRequestSchema);
