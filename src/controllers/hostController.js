const Accomodation = require("../models/Accomodation/accomodation");
const Booking = require("../models/Accomodation/bookingAccomodation");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");

const hostAccomodations = async (req, res) => {
  const currentUser = req.user._id;
  // #swagger.tags = ['host']
  try {
    const accomodations = await Accomodation.find({
      isActive: true,
      createdBy: currentUser,
    })
      .populate({
        path: "meals",
        select: "-createdAt -updatedAt -reviewsId -isActive -mealType",
      })
      .sort({ createdAt: -1 });

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

const hostBookings = async (req, res) => {
  // #swagger.tags = ['host']
  const host = req.user._id;
  try {
    const bookedAccommodation = await Booking.aggregate([
      // {
      //   $lookup: {
      //     from: "users",
      //     localField: "user",
      //     foreignField: "_id",
      //     as: "userDetails",
      //   },
      // },

      {
        $lookup: {
          from: "accomodations",
          localField: "accomodationsId",
          foreignField: "_id",
          as: "accommodation",
        },
      },

      {
        $match: {
          "accommodation.createdBy": host,
        },
      },
      {
        $project: {
          "accommodation.reviewsId": 0,
          "accommodation.meals": 0,
          "accommodation.location": 0,
          "accommodation.desc": 0,
          "accommodation.price": 0,
          "accommodation.capacity": 0,
          "accommodation.services": 0,
          "accommodation.createdBy": 0,
        },
      },
      // {
      //   $project: {
      //     "userDetails.username": 1,
      //     "userDetails.avatar": 1,
      //     "userDetails.email": 1,
      //   },
      // },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    const bookingCount = bookedAccommodation.length;
    SuccessHandler(
      {
        success: true,
        message: "Fetched Bookings",
        bookingCount,
        bookings: bookedAccommodation,
      },
      200,
      res
    );
  } catch (error) {
    ErrorHandler(error.message, 500, req, res);
  }
};

const bookingCount = async (req, res) => {
  // #swagger.tags = ['host']
  const host = req.user._id;

  try {
    const bookings = await Booking.aggregate([
      {
        $lookup: {
          from: "accomodations",
          localField: "accomodationsId",
          foreignField: "_id",
          as: "accommodationDetail",
        },
      },
      {
        $match: {
          "accommodationDetail.createdBy": host,
        },
      },

      {
        $project: {
          status: "$accommodationDetail.status",
        },
      },

      {
        $group: {
          _id: "$status",
          currentCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "current"] }, 1, 0],
            },
          },
        },
      },
    ]);
    console.log(bookings);
    if (!bookings) {
      return ErrorHandler("Booking does not exist", 400, req, res);
    }
    return SuccessHandler(
      {
        success: true,
        message: "Accommodations Fetched successfully",
        bookings,
      },
      200,
      res
    );
  } catch (error) {
    ErrorHandler(error.message, 500, req, res);
  }
};
module.exports = {
  hostAccomodations,
  hostBookings,
  bookingCount,
};
