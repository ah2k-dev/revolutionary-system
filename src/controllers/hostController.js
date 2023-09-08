const Accommodation = require("../models/Accommodation/accommodation");
const Review = require("../models/Reviews/review");
const Booking = require("../models/Accommodation/booking");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const path = require("path");
const Meal = require("../models/Meal/meal");

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
    const accommodationCount = accommodations.length;

    return SuccessHandler(
      {
        message: "Accommodations fetched successfully",
        accommodationCount,
        accommodations,
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getBookingsCount = async (req, res) => {
  // #swagger.tags = ['host']
  try {
    const host = req.user._id;

    const bookingCount = await Booking.aggregate([
      {
        $lookup: {
          from: "accommodations",
          localField: "accommodation",
          foreignField: "_id",
          as: "accommodationDetail",
        },
      },
      {
        $match: {
          "accommodationDetail.host": host,
        },
      },
      {
        $group: {
          _id: null,
          currentCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "current"] }, 1, 0],
            },
          },
          completedCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
            },
          },
          cancelledCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0],
            },
          },
          previousCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "previous"] }, 1, 0],
            },
          },
        },
      },
    ]);
    if (!bookingCount) {
      return ErrorHandler("Booking does not exist", 400, req, res);
    }

    return SuccessHandler(
      {
        message: "Bookings Count Fetched successfully",
        bookingCount,
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = {
  getAccomodations,
  getBookingsCount,
};
