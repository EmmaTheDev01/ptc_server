import mongoose from "mongoose";
import Advert from "../models/Advert.js";
import cloudinary from "../utils/cloudinaryConfig.js";
import { upload } from "../utils/multerConfig.js";

// Function to upload image to Cloudinary
const uploadImageToCloudinary = async (file) => {
  try {
    const result = await cloudinary.v2.uploader.upload(file.path, {
      folder: "adverts",
      eager: [{ width: 400, height: 300, crop: "fill" }],
    });
    return {
      public_id: result.public_id,
      url: result.secure_url,
    };
  } catch (err) {
    console.error("Error uploading image to Cloudinary:", err);
    throw new Error("Error uploading image to Cloudinary");
  }
};

// Controller for creating a new advert with photo upload or image URL
export const createAdvert = async (req, res, next) => {
  try {
    // Handle file uploads with Multer
    upload(req, res, async (err) => {
      if (err) {
        console.error("Error uploading files:", err);
        return next(err);
      }

      let photoLinks = [];

      if (req.files && req.files.length > 0) {
        photoLinks = await Promise.all(
          req.files.map(async (file) => {
            const photoUrl = await uploadImageToCloudinary(file);
            return {
              public_id: photoUrl.public_id,
              url: photoUrl.url,
            };
          })
        );
      }
      
      // Create new advert object
      const newAdvert = new Advert({
        title: req.body.title,
        desc: req.body.desc,
        price: req.body.price,
        photo: photoLinks, // Array of photo objects
        imageUrl: req.body.imageUrl,
        videoUrl: req.body.videoUrl,
        redirect: req.body.redirect,
        featured: req.body.featured || false,
        timeout: req.body.timeout 
      });

      // Save advert to MongoDB
      const savedAdvert = await newAdvert.save();

      res.status(200).json({
        success: true,
        message: "Advert saved successfully",
        data: savedAdvert,
      });
    });
  } catch (err) {
    console.error("Error creating advert:", err);
    next(err);
  }
};

// Controller for updating an advert with photo upload or image URL
export const updateAdvert = async (req, res, next) => {
  try {
    const id = req.params.id;

    // Handle file uploads with Multer
    upload(req, res, async (err) => {
      if (err) {
        console.error("Error uploading files:", err);
        return next(err);
      }

      let photoLinks = [];

      // Upload images to Cloudinary
      if (req.files && req.files.length > 0) {
        photoLinks = await Promise.all(
          req.files.map(async (file) => {
            const photoUrl = await uploadImageToCloudinary(file);
            return {
              public_id: photoUrl.public_id,
              url: photoUrl.url,
            };
          })
        );
      } else {
        // If no new files uploaded, retain existing photo links
        const existingAdvert = await Advert.findById(id);
        if (existingAdvert) {
          photoLinks = existingAdvert.photo;
        }
      }

      // Update advert in MongoDB
      const updatedAdvert = await Advert.findByIdAndUpdate(
        id,
        { $set: { ...req.body, photo: photoLinks } }, // Update fields including new photo links
        { new: true }
      );

      if (!updatedAdvert) {
        return res.status(404).json({
          success: false,
          message: "Advert not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Advert updated successfully",
        data: updatedAdvert,
      });
    });
  } catch (err) {
    console.error("Error updating advert:", err);
    next(err);
  }
};

// Controller for deleting an advert
export const deleteAdvert = async (req, res, next) => {
  const id = req.params.id;
  try {
    const deletedAdvert = await Advert.findByIdAndDelete(id);
    if (!deletedAdvert) {
      return res.status(404).json({
        success: false,
        message: "Advert not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Advert deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting advert:", err);
    next(err);
  }
};

// Controller for finding a single advert by ID
export const findAdvert = async (req, res, next) => {
  try {
    const id = req.params.id;

    // Validate ObjectId
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid advert ID",
      });
    }

    const findSingleAdvert = await Advert.findById(id);
    if (!findSingleAdvert) {
      return res.status(404).json({
        success: false,
        message: "Advert not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Advert details found",
      data: findSingleAdvert,
    });
  } catch (err) {
    console.error("Error finding advert:", err);
    next(err);
  }
};

// Controller for finding all adverts
export const findAllAdverts = async (req, res, next) => {
  try {
    const allAdverts = await Advert.find({});
    res.status(200).json({
      success: true,
      message: "All adverts available",
      data: allAdverts,
    });
  } catch (err) {
    console.error("Error finding all adverts:", err);
    next(err);
  }
};

// New controller function for fetching approved adverts
export const getApprovedAdverts = async (req, res, next) => {
  try {
    const approvedAdverts = await Advert.find({ approved: true });
    res.status(200).json({
      success: true,
      message: "Approved adverts",
      data: approvedAdverts,
    });
  } catch (err) {
    console.error("Error fetching approved adverts:", err);
    next(err);
  }
};

// Controller for searching adverts by title
export const getAdvertBySearch = async (req, res, next) => {
  const { title } = req.query;
  try {
    const advertSearch = await Advert.find({
      title: { $regex: new RegExp(title, "i") },
    });
    res.status(200).json({
      success: true,
      count: advertSearch.length,
      message: "Search results",
      data: advertSearch,
    });
  } catch (err) {
    console.error("Error searching adverts:", err);
    next(err);
  }
};

// Controller for fetching featured adverts
export const getFeaturedAdverts = async (req, res, next) => {
  try {
    const featuredAdverts = await Advert.find({ featured: true }).limit(8);
    if (featuredAdverts.length > 0) {
      res.status(200).json({
        success: true,
        message: "Featured adverts",
        data: featuredAdverts,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No featured adverts available",
      });
    }
  } catch (err) {
    console.error("Error fetching featured adverts:", err);
    next(err);
  }
};

// Controller for counting number of adverts
export const getAdvertCounts = async (req, res, next) => {
  try {
    const advertCount = await Advert.estimatedDocumentCount();
    res.status(200).json({
      success: true,
      message: "Total adverts count",
      data: advertCount,
    });
  } catch (err) {
    console.error("Error counting adverts:", err);
    next(err);
  }
};

// Simplified controller functions for ad viewing and rewards
export const startAdView = async (req, res) => {
  try {
    console.log("Ad view tracking started");
    res.status(200).json({ success: true, message: "Ad view tracking started" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const confirmAdView = async (req, res) => {
  try {
    console.log("Ad view confirmed, reward processed");
    res.status(200).json({ success: true, message: "Ad view confirmed, reward processed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelAdView = async (req, res) => {
  try {
    console.log("Ad view canceled, reward rejected");
    res.status(200).json({ success: true, message: "Ad view canceled, reward rejected" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Controller for approving an advert
export const approveAdvert = async (req, res) => {
  const id = req.params.id;

  try {
    const advert = await Advert.findByIdAndUpdate(
      id,
      { approved: true },
      { new: true }
    );

    if (!advert) {
      return res.status(404).json({
        success: false,
        message: "Advert not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Advert approved successfully",
      data: advert,
    });
  } catch (err) {
    console.error("Error approving advert:", err);
    res.status(500).json({
      success: false,
      message: "Failed to approve advert",
      error: err.message,
    });
  }
};
// Controller for disapproving an advert
export const disapproveAdvert = async (req, res) => {
  const id = req.params.id;

  try {
    const advert = await Advert.findByIdAndUpdate(
      id,
      { approved: false },
      { new: true }
    );

    if (!advert) {
      return res.status(404).json({
        success: false,
        message: "Advert not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Advert disapproved successfully",
      data: advert,
    });
  } catch (err) {
    console.error("Error disapproving advert:", err);
    res.status(500).json({
      success: false,
      message: "Failed to disapprove advert",
      error: err.message,
    });
  }
};

