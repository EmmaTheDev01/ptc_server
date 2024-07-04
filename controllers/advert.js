import Advert from "../models/Advert.js";
import cloudinary from "cloudinary";

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
    let photoLinks = [];

    // Handle single or multiple photos
    if (req.files && req.files.length > 0) {
      photoLinks = await Promise.all(
        req.files.map(async (file) => {
          const imageUrl = await uploadImageToCloudinary(file);
          return {
            public_id: imageUrl.public_id,
            url: imageUrl.url,
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
      imageUrl: req.body.imageUrl, // Include imageUrl from request body if needed
      featured: req.body.featured || false,
    });

    // Save advert to MongoDB
    const savedAdvert = await newAdvert.save();

    res.status(200).json({
      success: true,
      message: "Advert saved successfully",
      data: savedAdvert,
    });
  } catch (err) {
    console.error("Error creating advert:", err);
    next(err);
  }
};
// Controller for updating an advert
export const updateAdvert = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedFields = { ...req.body };

    // Handle single or multiple photos
    if (req.files && req.files.length > 0) {
      photoLinks = await Promise.all(
        req.files.map(async (file) => {
          const imageUrl = await uploadImageToCloudinary(file);
          return {
            public_id: imageUrl.public_id,
            url: imageUrl.url,
          };
        })
      );
    } else {
      // Remove photo if imageUrl is specified
      delete updatedFields.photo;
    }

    // Validate the updatedFields object
    const validationError = Advert.validate(updatedFields);
    if (validationError) {
      throw validationError;
    }

    const updatedAdvert = await Advert.findByIdAndUpdate(
      id,
      { $set: updatedFields },
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
    const findSingleAdvert = await Advert.findById(req.params.id);
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

// Controller for finding all adverts with pagination
export const findAllAdverts = async (req, res, next) => {
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
