const Accomodation = require("../models/Accomodation/accomodation");
const Review = require("../models/Reviews/review");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const path = require("path");
const bookingAccomodation = require("../models/Accomodation/bookingAccomodation");
//Create Accomodations
const createAccomodations = async (req, res) => {
  // #swagger.tags = ['accomodation']
  // TODO: image array
  try {
    const { title, desc, latitude, longitude, capacity, services, price } =
      req.body;

    const currentUser = req.user._id;
    const isAccomodationsExist = await Accomodation.findOne({
      title,
      createdBy: currentUser,
    });

    if (isAccomodationsExist) {
      return ErrorHandler("Accomodation already exist", 400, req, res);
    }

    const newAccomodations = await Accomodation.create({
      title,
      desc,
      price: Number(price),
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      capacity: Number(capacity),
      services,
      createdBy: currentUser,
    });

    await newAccomodations.save();

    return SuccessHandler(
      { success: true, message: "Added successfully", newAccomodations },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const updateAccomodations = async (req, res) => {
  // #swagger.tags = ['accomodation']
  // TODO: image array
  try {
    const { title, desc, latitude, longitude, capacity, services } = req.body;
    console.log(req.body);
    const currentUser = req.user._id;
    const updatedAccomodation = await Accomodation.findByIdAndUpdate(
      req.params.id,
      {
        title,
        desc,
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },

        capacity,
        services,
        createdBy: currentUser,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedAccomodation) {
      return ErrorHandler("Accomodation does not exist", 400, req, res);
    }

    return SuccessHandler(
      { success: true, message: "Updated successfully", updatedAccomodation },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const deleteAccomodations = async (req, res) => {
  // #swagger.tags = ['accomodation']
  // TODO: image array
  try {
    console.log(req.body);
    const updatedAccomodation = await Accomodation.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          isActive: false,
        },
      }
    );

    if (!updatedAccomodation) {
      return ErrorHandler("Accomodation does not exist", 400, req, res);
    }

    return SuccessHandler(
      { success: true, message: "Deleted successfully" },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getAllAccomodations = async (req, res) => {
  // #swagger.tags = ['accomodation']
  try {
    const capacityFilter = req.body.capacity
      ? {
          capacity: req.body.capacity,
        }
      : {};

    // Location filter
    const locationFilter =
      req.body.coordinates && req.body.coordinates.length == 2
        ? {
            location: {
              $near: {
                $geometry: {
                  type: "Point",
                  coordinates: req.body.coordinates,
                },
                $maxDistance: 10 * 1000,
              },
            },
          }
        : {};

    let unAvailableAccommodations = [];

    if (req.body.date && req.body.date > 0) {
      const bookings = await bookingAccomodation.find({
        startDate: {
          $gte: req.body.date[0],
        },
        endDate: {
          $lte: req.body.date[1],
        },
      });

      unAvailableAccommodations = bookings.map((val, ind) => {
        return val.accomodationsId;
      });
    }

    const availabilityFilter =
      unAvailableAccommodations.length > 0
        ? {
            _id: {
              $nin: unAvailableAccommodations,
            },
          }
        : {};

    const getAccomodations = await Accomodation.find({
      isActive: true,
      ...capacityFilter,
      ...locationFilter,
      ...availabilityFilter,
    }).populate("reviewsId");

    const totalAccomodation = getAccomodations.length;

    if (!getAccomodations) {
      return ErrorHandler("Accomodation does not exist", 400, req, res);
    }

    return SuccessHandler(
      {
        success: true,
        message: "Fetched successfully",
        totalAccomodation,
        getAccomodations,
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

// Add a new Review

const addReview = async (req, res) => {
  const currentUser = req.user._id;
  // #swagger.tags = ['accomodation']

  try {
    const accomodationId = req.params.id;
    const { rating, comment } = req.body;

    const accomodation = await Accomodation.findById(accomodationId);

    if (!accomodation) {
      return ErrorHandler("The Accomodation doesn't exist", 400, req, res);
    }

    // Check if a review with the same comment already exists
    const existingReview = await Review.findOne({
      user: currentUser,
      accomodation: accomodationId,
      comment,
    });

    if (existingReview) {
      // update existing review
      existingReview.rating = rating;
      existingReview.comment = comment;
      await existingReview.save();

      return SuccessHandler(
        {
          success: true,
          message: "Review Updated successfully",
          review: existingReview,
        },
        200,
        res
      );
    } else {
      // create a new review
      const review = await Review.create({
        rating,
        comment,
        user: currentUser,
        accomodation: accomodationId,
      });

      await review.save();

      await Accomodation.findByIdAndUpdate(accomodationId, {
        $push: { reviewsId: review._id },
      });

      return SuccessHandler(
        { success: true, message: "Review Added successfully", review },
        200,
        res
      );
    }
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

// Getting reviews
const getReviews = async (req, res) => {
  // #swagger.tags = ['accomodation']
  try {
    const accomodationId = req.params.id;
    const accomodation = await Accomodation.findById(accomodationId).populate(
      "reviewsId"
    );
    if (!accomodation) {
      return res.status(404).json({ message: "Accomodation not found" });
    }

    const reviews = accomodation.reviewsId;

    let totalRating = 0;
    for (let rev of reviews) {
      totalRating += rev.rating;
    }

    const avgRating = (totalRating / reviews.length).toFixed(1);

    return SuccessHandler(
      {
        success: true,
        message: "Fetched Reviews successfully",
        avgRating,
        reviews,
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

// Getting reviews
const deleteReview = async (req, res) => {
  // #swagger.tags = ['accomodation']
  try {
    const { reviewId } = req.query;
    const accomodationId = req.params.id;
    // console.log(reviewId);
    const review = await Review.findByIdAndDelete({
      _id: reviewId,
    });
    console.log(review);

    if (!review) {
      return ErrorHandler(
        { success: false, message: "Review not found or unauthorized" },
        404,
        req,
        res
      );
    }

    await Accomodation.findByIdAndUpdate(accomodationId, {
      $pull: { reviewsId: reviewId },
    });

    return SuccessHandler(
      { success: true, message: "Review has been Deleted" },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = {
  createAccomodations,
  updateAccomodations,
  deleteAccomodations,
  getAllAccomodations,
  addReview,
  getReviews,
  deleteReview,
};
