const Review = require("../models/Review/review");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const Accomodation = require("../models/Accomodation/accomodation");
const path = require("path");

//Add a new Review
const addReviews = async (req, res) => {
  // #swagger.tags = ['review']
  try {
    const accomodationId = req.params.id;
    const { rating, comment } = req.body;
    if (req.user.role === "user") {
      const accommodation = await Accomodation.findById(accomodationId); // Use accomodationId here
      console.log(accommodation);

      if (!accommodation) {
        return ErrorHandler("Accommodation Does not exist", 400, req, res);
      }

      const review = new Review({
        rating,
        comment,
        userId: req.user._id,
      });

      await review.save();

      await Accomodation.findByIdAndUpdate(req.params.id, {
        $push: { reviewsId: review._id },
      });

      return SuccessHandler(
        { message: "Reviews Added successfully", review },
        200,
        res
      );
    } else {
      return ErrorHandler("Unauthorized User", 400, req, res);
    }
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const gettingReviews = async (req, res) => {
  // #swagger.tags = ['review']
  try {
    const accomodationId = req.params.id;
    if (req.user.role === "user") {
      // console.log(accomodationId);
      const accomodation = await Accomodation.findById(accomodationId).populate(
        "reviewsId"
      );
      const reviews = accomodation.reviewsId;

      let totalRating = 0;
      for (let rev of reviews) {
        totalRating += rev.rating;
      }

      const avgRating = (totalRating / reviews.length).toFixed(1);

      console.log(reviews);
      if (!accomodation) {
        return res.status(404).json({ message: "Accomodation not found" });
      }
      if (accomodation.length === 0) {
        return res
          .status(404)
          .json({ message: "No reviews found for this product" });
      }

      return SuccessHandler(
        { message: "Fetched Reviews successfully", avgRating, reviews },
        200,
        res
      );
    } else {
      return ErrorHandler("Unauthorized User", 400, req, res);
    }
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = {
  addReviews,
  gettingReviews,
};
