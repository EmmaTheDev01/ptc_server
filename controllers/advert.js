import Advert from "../models/Advert.js";
import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Function to upload image to Cloudinary
const uploadImageToCloudinary = async (file) => {
  if (!file) return null;
  
  try {
    const result = await cloudinary.v2.uploader.upload(file.path, {
      folder: "adverts",
      eager: [{ width: 400, height: 300, crop: "fill" }]
    });
    return result.secure_url;
  } catch (err) {
    console.error("Error uploading image to Cloudinary:", err);
    throw new Error("Error uploading image to Cloudinary");
  }
};

// Controller for creating a new advert
export const createAdvert = async (req, res) => {
  try {
    const imageUrl = await uploadImageToCloudinary(req.file);

    const newAdvert = new Advert({
      ...req.body,
      photo: {
        public_id: req.body.photo.public_id,
        url: imageUrl || req.body.photo.url, // Update photo url if uploaded
      },
      featured: req.body.featured || false, // Set featured status
    });

    const savedAdvert = await newAdvert.save();

    res.status(200).json({
      success: true,
      message: "Advert saved successfully",
      data: savedAdvert
    });
  } catch (err) {
    console.error("Error creating advert:", err);
    res.status(500).json({
      success: false,
      message: 'Advert not saved, try again!'
    });
  }
};

// Controller for updating an advert
export const updateAdvert = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedFields = { ...req.body };
    const imageUrl = await uploadImageToCloudinary(req.file);

    if (imageUrl) {
      updatedFields.photo = {
        public_id: req.body.photo.public_id,
        url: imageUrl, // Update photo url if uploaded
      };
    }

    // Ensure featured is updated if provided
    if (req.body.featured !== undefined) {
      updatedFields.featured = req.body.featured;
    }

    const updatedAdvert = await Advert.findByIdAndUpdate(
      id,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedAdvert) {
      return res.status(404).json({
        success: false,
        message: "Advert not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Advert updated successfully",
      data: updatedAdvert
    });
  } catch (err) {
    console.error("Error updating advert:", err);
    res.status(500).json({
      success: false,
      message: "Advert not updated, try again"
    });
  }
};

// Controller for deleting an advert
export const deleteAdvert = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedAdvert = await Advert.findByIdAndDelete(id);
    if (!deletedAdvert) {
      return res.status(404).json({
        success: false,
        message: "Advert not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Advert deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting advert:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete advert"
    });
  }
};

// Controller for finding a single advert by ID
export const findAdvert = async (req, res) => {
  try {
    const findSingleAdvert = await Advert.findById(req.params.id);
    if (!findSingleAdvert) {
      return res.status(404).json({
        success: false,
        message: "Advert not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Advert details found",
      data: findSingleAdvert,
    });
  } catch (err) {
    console.error("Error finding advert:", err);
    res.status(500).json({
      success: false,
      message: "Failed to find advert"
    });
  }
};

// Controller for finding all adverts with pagination
export const findAllAdverts = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  try {
    const perPage = 8;
    const allAdverts = await Advert.find({})
      .skip(page * perPage)
      .limit(perPage);
    const count = await Advert.countDocuments({});
    res.status(200).json({
      success: true,
      count,
      message: "All adverts available",
      data: allAdverts,
    });
  } catch (err) {
    console.error("Error finding all adverts:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch adverts"
    });
  }
};

// Controller for searching adverts by title
export const getAdvertBySearch = async (req, res) => {
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
    res.status(500).json({
      success: false,
      message: "Failed to search adverts"
    });
  }
};

// Controller for fetching featured adverts
export const getFeaturedAdverts = async (req, res) => {
  try {
    const featuredAdverts = await Advert.find({ featured: true })
      .limit(8);
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
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured adverts"
    });
  }
};

// Controller for counting number of adverts
export const getAdvertCounts = async (req, res) => {
  try {
    const advertCount = await Advert.estimatedDocumentCount();
    res.status(200).json({
      success: true,
      message: "Total adverts count",
      data: advertCount,
    });
  } catch (err) {
    console.error("Error counting adverts:", err);
    res.status(500).json({
      success: false,
      message: "Failed to count adverts"
    });
  }
};
