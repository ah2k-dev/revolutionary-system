const Accommodation = require("../models/Accommodation/accommodation");
const Booking = require("../models/Accommodation/booking");
const Review = require("../models/Reviews/review");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const mongoose = require("mongoose");
const moment = require("moment");
//Create Booking
const createBooking = async (req, res) => {
  // #swagger.tags = ['booking']
  const currentUser = req.user._id;
  const accommodationId = req.params.id;
  console.log(accommodationId);
  try {
    const {
      startDate,
      endDate,
      roomsBooked,
      dinnerSeats,
      accommodationTotal,
      dinnerTotal,
      subTotal,
    } = req.body;

    // roomBook should not be greater than dinnerSeats
    const accommodation = await Accommodation.findById(accommodationId);
    if (!accommodation) {
      return ErrorHandler("Accommodation doesn't already exist", 400, req, res);
    }
    // const eDate = new Date(Date.parse(req.body.endDate));
    // const sDate = new Date(Date.parse(req.body.startDate));
    // console.log("eDate", eDate);

    // const timeDifference = new Date(eDate.getTime() - sDate.getTime());
    // const numberOfDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    // console.log("numberOfDays", numberOfDays);
    // console.log("timeDifference", timeDifference);

    // const accommodationTotal =
    //   accommodation.roomPrice * roomsBooked * numberOfDays;
    // console.log(accommodation.roomPrice);
    // const dinnerTotal = accommodation.dinnerPrice * dinnerSeats * numberOfDays;

    if (roomsBooked > dinnerSeats) {
      return ErrorHandler(
        "The Rooms shouldn't be greater than Dinner Seats",
        400,
        req,
        res
      );
    }

    const sDate = moment(startDate).startOf("day").format();
    const eDate = moment(endDate).endOf("day").format();

    // const bookings = await Booking.find({
    //   accommodation: accommodationId,
    // });
    // console.log("bookings", bookings);
    const bookings = await Booking.aggregate([
      {
        $match: {
          accommodation: mongoose.Types.ObjectId(accommodationId),
          status: "active",
          startDate: { $gte: new Date(sDate) },
          endDate: { $lte: new Date(eDate) },
        },
      },
      {
        $group: {
          _id: "$accommodation",
          totalBookedRoom: { $sum: "$roomsBooked" },
          totalDinnerSeatsBook: { $sum: "$dinnerSeats" },
        },
      },
    ]);
    // console.log("newBookings block", bookings);
    // console.log(bookings);
    // console.log("ROOMS", totalBookedRoom);
    // console.log("SEATS", totalDinnerSeatsBook);
    if (bookings.length > 0) {
      const [{ totalBookedRoom, totalDinnerSeatsBook }] = bookings;
      const availableDinnerSeats =
        accommodation.dinnerCapacity - totalDinnerSeatsBook;
      const availableRooms = accommodation.roomCapacity - totalBookedRoom;
      // console.log("availableDinnerSeats: ", availableDinnerSeats);
      // console.log("availableRooms: ", availableRooms);
      if (roomsBooked > availableRooms) {
        return ErrorHandler(
          `Rooms in the accommodation are currently unavailable. We only have ${availableRooms} available`,
          400,
          req,
          res
        );
      }

      if (dinnerSeats > availableDinnerSeats) {
        return ErrorHandler(
          `Rooms in the accommodation are currently unavailable. We only have ${availableDinnerSeats} available`,
          400,
          req,
          res
        );
      }
    }

    const newBooking = await Booking.create({
      user: currentUser,
      accommodation: accommodationId,
      dinnerTotal,
      accommodationTotal,
      roomsBooked,
      dinnerSeats,
      startDate: new Date(sDate),
      endDate: new Date(eDate),
      subTotal,
    });

    // await Accommodation.findByIdAndUpdate(accommodationId, {
    //   $set: {
    //     availableRoomCapacity:
    //       accommodation.availableRoomCapacity - roomsBooked,
    //     availableDinnerCapacity:
    //       accommodation.availableDinnerCapacity - dinnerSeats,
    //   },
    // });
    // const updatedAccommodation = await Accommodation.findById(accommodationId);

    // if (updatedAccommodation.availableRoomCapacity === 0) {
    //   // Update the status to "Booked"
    //   await Accommodation.findByIdAndUpdate(accommodationId, {
    //     $set: {
    //       status: "Booked",
    //     },
    //   });
    // }

    return SuccessHandler(
      { message: "Booking Created successfully", newBooking },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const cancelTheBooking = async (req, res) => {
  // #swagger.tags = ['booking']
  try {
    const currentUser = req.user._id;
    const bookingId = req.params.bookingId;
    const booking = await Booking.findOne({
      user: currentUser,
      _id: bookingId,
    });

    if (!booking) {
      return ErrorHandler(
        "Booking does not exist or you did not make booking",
        404,
        req,
        res
      );
    }
    const timeDifference = new Date() - booking.createdAt;
    if (timeDifference >= 24 * 60 * 60 * 1000) {
      return ErrorHandler(
        "24 hours passed since you made booking",
        400,
        req,
        res
      );
    } else {
      await Booking.findByIdAndUpdate(bookingId, {
        $set: { status: "cancelled", isActive: false },
      });

      // await Accommodation.findByIdAndUpdate(booking.accommodation, {
      //   $inc: {
      //     availableDinnerCapacity: booking.dinnerSeats,
      //     availableRoomCapacity: booking.roomsBooked,
      //   },
      // });

      SuccessHandler(
        { message: "Booking fetch Successfully", booking },
        200,
        res
      );
    }
  } catch (error) {
    ErrorHandler(error.message, 500, req, res);
  }
};
const addReviews = async (req, res) => {
  // #swagger.tags = ['booking']
  try {
    const currentUser = req.user._id;
    const bookingId = req.params.bookingId;

    const { rating, comment } = req.body;
    const booking = await Book.findOne({
      _id: bookingId,
      user: currentUser,
      status: "completed",
    });
    if (!booking) {
      return ErrorHandler(
        "No Such Booking exist or you're not the user who made the booking.",
        400,
        req,
        res
      );
    }
    const accommodationId = booking.accommodation;
    const review = await Review.create({
      rating,
      comment,
      user: currentUser,
      accommodation: accommodationId,
    });
    await review.save();
    const accomodationReview = await Review.find({
      accommodation: accommodationId,
    });
    console.log(accomodationReview);
    let allRating = accomodationReview.map((accRating) => accRating.rating);
    // console.log(allRating);
    let totalRating = allRating.reduce(
      (acc, currentRating) => acc + currentRating,
      0
    );
    const avgRating = totalRating / accomodationReview.length;

    await Accommodation.findByIdAndUpdate(accommodationId, {
      $push: { reviewsId: review._id },
      rating: avgRating.toFixed(1),
    });
    return SuccessHandler(
      { message: "Reviews Added Successfully", review },
      200,
      res
    );
  } catch (error) {
    ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = {
  createBooking,
  cancelTheBooking,
  addReviews,
};
