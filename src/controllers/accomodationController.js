const Accomodation = require("../models/Accomodation/accomodation");
const Review = require("../models/Accomodation/review");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const path = require("path");
const mongoose = require("mongoose");
//Create Accomodations
const createAccomodations = async (req, res) => {
  // #swagger.tags = ['accomodation']
  // TODO: image array
  try {
    const { title, desc, latitude, longitude, capacity, services, rent } =
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
      rent,
      location: {
        type: "Point",
        coordinates: [latitude, longitude],
      },
      capacity,
      services,
      createdBy: currentUser,
    });

    await newAccomodations.save();

    return SuccessHandler(
      { message: "Added successfully", newAccomodations },
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
          cordinates: [latitude, longitude],
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
      { message: "Updated successfully", updatedAccomodation },
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

    return SuccessHandler({ message: "Deleted successfully" }, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getAllAccomodations = async (req, res) => {
  // #swagger.tags = ['accomodation']
  // TODO: image array
  try {
    const capacityFilter = req.body.capacity
      ? {
          capacity: req.body.capacity,
        }
      : {};

    const locationFilter =
      req.body.coordinates && req.body.coordinates.length > 0
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

    console.log(locationFilter);

    //   {
    //     <location field>: {
    //       $near: {
    //         $geometry: {
    //            type: "Point" ,
    //            coordinates: [ <longitude> , <latitude> ]
    //         },
    //         $maxDistance: <distance in meters>,
    //         $minDistance: <distance in meters>
    //       }
    //     }
    //  }

    const getAccomodations = await Accomodation.find({
      isActive: true,
      ...capacityFilter,
      ...locationFilter,
    }).populate("reviewsId");
    const totalAccomodation = getAccomodations.length;

    if (!getAccomodations) {
      return ErrorHandler("Accomodation does not exist", 400, req, res);
    }

    return SuccessHandler(
      { message: "Fetched successfully", getAccomodations, totalAccomodation },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

//Add a new Review
const addReview = async (req, res) => {
  const currentUser = req.user._id;
  // #swagger.tags = ['accomodation']

  try {
    const accomodationId = req.params.id;
    const { rating, comment } = req.body;

    if (req.user.role === "user") {
      const accomodation = await Accomodation.findById(accomodationId);

      if (!accomodation) {
        return ErrorHandler("accomodation Does not exist", 400, req, res);
      }

      // Check if a review with the same comment already exists for the user and accomodation
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
          { message: "Review Updated successfully", review: existingReview },
          200,
          res
        );
      } else {
        // create a new review
        const review = new Review({
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
          { message: "Review Added successfully", review },
          200,
          res
        );
      }
    } else {
      return ErrorHandler("Unauthorized User", 400, req, res);
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
    if (req.user.role === "user") {
      // console.log(accomodationId);
      // const accomodationObjectId = mongoose.Types.ObjectId(accomodationId);
      // const Isaccomodation = await Accomodation.findById(accomodationObjectId);
      // if (!Isaccomodation) {
      //   return ErrorHandler("accomodation Does not exist", 400, req, res);
      // }

      const accomodation = await Accomodation.findById(accomodationId).populate(
        "reviewsId"
      );
      // if (!Isaccomodation) {
      //   return ErrorHandler("accomodation Does not exist", 400, req, res);
      // }

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

// Getting reviews
const deleteReview = async (req, res) => {
  // #swagger.tags = ['accomodation']
  try {
    const { reviewId } = req.query;
    const accomodationId = req.params.id;
    if (req.user.role === "user") {
      // console.log(reviewId);
      const review = await Review.findByIdAndDelete({
        _id: reviewId,
      });
      console.log(review);

      if (!review) {
        return ErrorHandler("Review not found or unauthorized", 404, req, res);
      }

      await Accomodation.findByIdAndUpdate(accomodationId, {
        $pull: { reviewsId: reviewId },
      });

      return SuccessHandler("Review has been Deleted", 200, res);
    } else {
      return ErrorHandler("Unauthorized User", 400, req, res);
    }
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
