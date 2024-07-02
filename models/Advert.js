import mongoose from "mongoose";

const advertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    photo: {
      public_id: {
        type: String,

      },
      url: {
        type: String,

      },
    },
    desc: {
      type: String,
      required: true,
    },
    avgRating: {
      type: Number,
    },
    price: {
      type: Number,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false, // Default value for featured is false
    },
  },
  { timestamps: true }
);

export default mongoose.model("Advert", advertSchema);
