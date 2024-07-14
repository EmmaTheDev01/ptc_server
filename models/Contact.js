import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v) => /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v),
        message: 'Invalid email address',
      },
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v) => /^\+?[1-9]\d{1,14}$/.test(v),
        message: 'Invalid phone number',
      },
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,  // Automatically adds `createdAt` and `updatedAt` fields
  }
);

export default mongoose.model('Contact', contactSchema);
