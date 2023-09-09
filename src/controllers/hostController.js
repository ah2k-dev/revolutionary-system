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

const hostEarnings = async (req, res) => {
  // #swagger.tags = ['host']
  try {
    const host = req.user._id;

    const earning = await Booking.aggregate([
      {
        $match: {
          status: "completed",
        },
      },
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
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: "$subTotal" },
        },
      },
      {
        $project: {
          monthName: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id.month", 1] }, then: "January" },
                { case: { $eq: ["$_id.month", 2] }, then: "February" },
                { case: { $eq: ["$_id.month", 3] }, then: "March" },
                { case: { $eq: ["$_id.month", 4] }, then: "April" },
                { case: { $eq: ["$_id.month", 5] }, then: "May" },
                { case: { $eq: ["$_id.month", 6] }, then: "June" },
                { case: { $eq: ["$_id.month", 7] }, then: "July" },
                { case: { $eq: ["$_id.month", 8] }, then: "August" },
                { case: { $eq: ["$_id.month", 9] }, then: "September" },
                { case: { $eq: ["$_id.month", 10] }, then: "October" },
                { case: { $eq: ["$_id.month", 11] }, then: "November" },
                { case: { $eq: ["$_id.month", 12] }, then: "December" },
              ],
              default: "Unknown month",
            },
          },
          total: 1,
        },
      },
      {
        $project: {
          monthTotal: {
            $concat: [
              "subTotal in ",
              "$monthName",
              ": ",
              { $toString: "$total" },
            ],
          },
        },
      },

      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);
    if (!earning) {
      return ErrorHandler("not exist", 400, req, res);
    }

    return SuccessHandler(
      {
        message: "Earing Fetched successfully",
        earning,
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getBookings = async (req, res) => {
  // #swagger.tags = ['host']
  try {
    const hostAccommodations = await accommodation
      .find({
        host: req.user._id,
      })
      .distinct("_id");

    const hostBookings = await booking.find({
      accommodation: {
        $in: hostAccommodations,
      },
    });

    return SuccessHandler(
      {
        message: "Bookings fetched successfully",
        hostBookings,
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
  hostEarnings,
  getBookings,
};
