import mongoose from "mongoose";

const advertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    photo: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    imageUrl: {
      type: String,
    },
    videoUrl: {
      type: String,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    redirect: {
      type: String,
      required: true,
    },
    avgRating: {
      type: Number,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Advert", advertSchema);
