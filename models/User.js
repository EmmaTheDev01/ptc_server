import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10}$/, "Phone number must be exactly 10 digits"],
    },
    currentBalance: {
      type: Number,
      default: 0,
      min: [0, "Current balance cannot be negative"],
    },
    withdrawnBalance: {
      type: Number,
      default: 0,
      min: [0, "Withdrawn balance cannot be negative"],
    },
    membership: {
      type: String,
      enum: ["basic", "standard", "premium"],
      default: "basic",
    },
    membershipUpdatedAt: {
      type: Date,
      default: null, // Initialize as null if no upgrade has occurred yet
    },
    photo: {
      public_id: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
        match: [/^https?:\/\/.+/, "Please use a valid URL for the photo"],
      },
    },
    role: {
      type: String,
      enum: ["user", "admin"], // Consider specifying possible roles
      default: "user",
    },
    createdAt: { type: Date, default: Date.now },
    bonus: {
      type: Number,
      default: 500,
    },
    referralCode: {
      type: String,
      default: function () {
        // Generate random referral code
        const randomBytes = crypto.randomBytes(3).toString("hex").toUpperCase();
        return `REF-${randomBytes}`;
      },
      unique: true,
    },
    referredBy: {
      type: String,
      default: "", // Store the referral code of the user who referred this user
      match: [/^REF-[A-F0-9]{6}$/, "Please use a valid referral code"], // Adjust if needed
    },
    watchedAds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Advert',
      },
    ],
  },
  { timestamps: true }
);

// Middleware to update `membershipUpdatedAt` when `membership` field changes
userSchema.pre('save', function (next) {
  if (this.isModified('membership')) {
    this.membershipUpdatedAt = new Date();
  }
  next();
});

export default mongoose.model("User", userSchema);
