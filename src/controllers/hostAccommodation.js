const Accomodation = require("../models/Accomodation/accomodation");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");

const hostAccomodations = async (req, res) => {
  const currentUser = req.user._id;
  // #swagger.tags = ['host']
  try {
    const accomodations = await Accomodation.find({
      isActive: true,
      currentUser,
    }).populate({
      path: "meals",
      select: "-createdAt -updatedAt -reviewsId -isActive -mealType",
    });

    const totalAccomodation = accomodations.length;

    if (!accomodations) {
      return ErrorHandler("Accommodation does not exist", 400, req, res);
    }

    return SuccessHandler(
      {
        success: true,
        message: "Accommodations Fetched successfully",
        totalAccomodation,
        accomodations,
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = {
  hostAccomodations,
};
