import Advert from "../models/Advert.js";


export const createAdvert = async (req, res) => {
  const newAdvert = new Advert(req.body);
  try {
      const savedAdvert = await newAdvert.save();
      res.status(200).json({
          success: true,
          message: "Advert saved succesfully",
          data: savedAdvert
      });
  }
  catch (err) {
      res.status(500).json({
          success: false,
          message: 'Advert not saved, try again!'
      });
  }
};

//Updating Adverts
export const updateAdvert = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedAdvert = await Advert.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "successfully updated Advert",
      data: updatedAdvert,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Advert not updated, try again",
    });
  }
};
// delete a Advert
export const deleteAdvert = async (req, res) => {
  const id = req.params.id;
  try {
    await Advert.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Advert deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete Advert",
    });
  }
};//find a Advert
export const findAdvert = async (req, res) => {
  try {
    const findSingleAdvert = await Advert.findById(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Advert details found",
      data: findSingleAdvert,
    });
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: "Can not find a Advert",
    });
  }
};

//find all Adverts
export const findAllAdverts = async (req, res) => {
  const page = parseInt(req.query.page);
  try {
    const allAdverts = await Advert.find({})
      .populate("reviews")
      .skip(page * 8)
      .limit(8);
    const count = await Advert.countDocuments({});
    res.status(200).json({
      success: true,
      count,
      message: "All Adverts available",
      data: allAdverts,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "No Adverts available",
    });
  }
};

// Get a Advert from a search query
export const getAdvertBySearch = async (req, res) => {
  const { city, distance,title } = req.query;
  try {
    const AdvertSearch = await Advert.find({
      city: { $regex: new RegExp(city, "i") },
      distance: { $gte: parseInt(distance) },
      title: { $regex: new RegExp(title, "i") },
    }).populate("reviews");
    res.status(200).json({
      success: true,
      count: AdvertSearch.length,
      message: "Search results",
      data: AdvertSearch,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "No such Adverts found",
    });
  }
};

//get featured Adverts

export const getFeauturedAdvert = async (req, res) => {
  try {
    const featuredAdverts = await Advert.find({ featured: true })
      .populate("reviews")
      .limit(8);
    if (featuredAdverts.length > 0) {
      res.status(200).json({
        success: true,
        message: "Featured Adverts",
        data: featuredAdverts,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No Adverts available",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred",
    });
  }
};
//Count number of Adverts on page
export const getAdvertCounts = async (req, res) => {
  try {
    const AdvertCount = await Advert.estimatedDocumentCount();

    res.status(200).json({
      success: true,
      message: "Featured Adverts",
      data: AdvertCount,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "No Adverts available",
    });
  }
};
