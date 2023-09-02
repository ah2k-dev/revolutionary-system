const dotenv = require("dotenv");
dotenv.config({ path: ".././src/config/config.env" });
const Book = require("../models/Accomodation/bookingAccomodation");
const Review = require("../models/Reviews/review");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const Accomodation = require("../models/Accomodation/accomodation");
const path = require("path");
const stripe = require("stripe")(process.env.SECRET_KEY);

//Book a new Accomm
const bookNewAccomm = async (req, res) => {
  const currentUser = req.user._id;
  try {
    const accomodationId = req.params.id;
    const {
      startDate,
      endDate,
      // checkIn,
      // checkOut,
      phone,
      subTotal,
      capacity,
      selectedMeals,
      // stripeToken,
    } = req.body;
    // console.log(req.body);
    const currentAccommodation = await Accomodation.findById(accomodationId);

    if (!currentAccommodation) {
      return ErrorHandler("Accommodation Does not exist", 400, req, res);
    }

    const bookings = await Book.find({
      accomodationsId: accomodationId,
      user: currentUser,
      startDate: {
        $gte: req.body.startDate,
      },
      endDate: {
        $lte: req.body.endDate,
      },
    });
    if (bookings.length > 0) {
      return ErrorHandler("Accommodation already book", 400, req, res);
    }
    // const isBooked = await Book.findOne({
    //   accomodationsId: accomodationId,
    // });
    // if (isBooked) {
    //   return ErrorHandler("Already Booked", 400, req, res);
    // }

    // const charge = await stripe.charges.create({
    //   amount: subTotal * 100,
    //   currency: "usd",
    //   source: stripeToken,
    //   description: accomodationId,
    // });

    // if (!charge) {
    //   return ErrorHandler("Payment Failed", 400, req, res);
    // }
    // else {
    // JSON.parse(selectedMeals)
    // : JSON.parse(selectedMeals)
    const newBooking = await Book.create({
      user: currentUser,
      accomodationsId: accomodationId,
      startDate,
      endDate,
      // checkIn,
      // checkOut,
      phone,
      capacity,
      subTotal,
      selectedMeals,
    });

    await newBooking.save();

    return SuccessHandler(
      {
        success: true,
        message: "Payment Successful and Booking Added",
        newBooking,
      },
      200,
      res
    );
    // }
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getUserBookings = async (req, res) => {
  const currentUser = req.user._id;

  // #swagger.tags = ['booking']
  try {
    // const bookings = await Book.find({ user: currentUser }).populate({
    //   path: "accomodationsId",
    //   populate: {
    //     path: "selectedMeals",
    //   },
    // });
    // const bookings = await Book
    //   .find({ user: currentUser })
    //   .populate("accomodationsId")
    //   .populate("selectedMeals");

    // update status
    await Book.updateMany(
      {
        user: currentUser,
        endDate: { $lt: new Date() },
      },
      {
        $set: { status: "completed" },
      }
    );
    const bookings = await Book.find({ user: currentUser })
      .populate("accomodationsId")
      .populate({
        path: "selectedMeals",
        populate: {
          path: "meal",
          select: "dishName images",
        },
      });
    if (!bookings) {
      return ErrorHandler("No Such Booking exist", 400, req, res);
    }

    return SuccessHandler(
      { success: true, message: "Booking Fetched successfully", bookings },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const cancelBooking = async (req, res) => {
  // #swagger.tags = ['booking']
  try {
    const currentUser = req.user._id;
    const bookingId = req.params.id;
    const booking = await Book.findOne({
      _id: bookingId,
      user: currentUser,
    });
    if (!booking) {
      return ErrorHandler("Booking does not exist", 400, req, res);
    }
    // console.log(booking);
    let created = booking.createdAt;
    // console.log(created);
    let dateDiff = new Date() - new Date(created);
    // console.log(dateDiff);
    if (dateDiff < 24 * 60 * 60 * 1000) {
      // console.log("less than24 hour");
      await Book.findByIdAndUpdate(bookingId, {
        $set: { status: "cancelled" },
      });
    } else {
      // console.log("greater tha 24 hour");
      return ErrorHandler(
        "Booking can be cancelled within 24 hours",
        400,
        req,
        res
      );
    }

    // const booking = await Book.aggregate([
    //   {$match: {_id: bookingId,  user: currentUser}},
    //   {$cond: {
    //     if: {$lt : {}}
    //   }}

    // ])

    SuccessHandler({ success: true, message: "Booking Cancelled" }, 200, res);
  } catch (error) {
    ErrorHandler(error.message, 500, req, res);
  }
};

const addReviews = async (req, res) => {
  // #swagger.tags = ['booking']
  const currentUser = req.user._id;
  const bookingId = req.params.id;
  try {
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

    const accommodationId = booking.accomodationsId;

    const review = await Review.create({
      rating: rating,
      comment,
      user: currentUser,
      accomodation: accommodationId,
    });
    await review.save();

    const accomodationReview = await Review.find({
      accomodation: accommodationId,
    });
    // console.log(accomodationReview);
    let allRating = accomodationReview.map((accRating) => accRating.rating);

    let totalRating = allRating.reduce(
      (acc, currentRating) => acc + currentRating,
      0
    );
    const avgRating = totalRating / accomodationReview.length;

    await Accomodation.findByIdAndUpdate(accommodationId, {
      $push: { reviewsId: review._id },
      rating: avgRating.toFixed(1),
    });

    return SuccessHandler({ message: "Review added successfully" }, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = {
  bookNewAccomm,
  getUserBookings,
  cancelBooking,
  addReviews,
};
