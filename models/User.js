import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    currentBalance: {
      type: Number,
      default: 0,
    },
    withdrawnBalance: {
      type: Number,
      default: 0,
    },
    photo: {
      public_id: {
        type: String,
        required: false, // Make this field not required
      },
      url: {
        type: String,
        required: false, // Make this field not required
      },
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
