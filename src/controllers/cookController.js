const Accommodation = require("../models/Accommodation/accommodation");
const Review = require("../models/Reviews/review");
const Booking = require("../models/Accommodation/booking");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const path = require("path");
const Meal = require("../models/Meal/meal");
const accommodation = require("../models/Accommodation/accommodation");
const booking = require("../models/Accommodation/booking");

// Host Accommodation
const getAccomodations = async (req, res) => {
  // #swagger.tags = ['host']
  const currentUser = req.user._id;
  try {
    const accommodations = await Accommodation.find({
      isActive: true,
      host: currentUser,
    });
    if (!accommodations) {
      return ErrorHandler("Accommodation doesn't exist", 400, req, res);
    }

    return SuccessHandler(
      {
        message: "Accommodation fetched successfully",
        baseUrl: `${process.env.BASE_URL}/uploads/`,
        accommodations,
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = {
  getMeals,
};
