const bookAccomm = require("../models/Accomodation/bookingAccomodation");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const Accomodation = require("../models/Accomodation/accomodation");
const path = require("path");

//Book a new Accomm
const bookNewAccomm = async (req, res) => {
  const currentUser = req.user._id;
  try {
    const accomodationId = req.params.id;
    const { startDate, endDate, checkIn, checkOut, subTotal, capacity, phoneNumber } =
      req.body;

    const currentAccommodation = await Accomodation.findById(accomodationId);

    if (!currentAccommodation) {
      return ErrorHandler("Accommodation Does not exist", 400, req, res);
    }

    const isBooked = await bookAccomm.findOne({
      accomodationsId: accomodationId,
    });
    if (isBooked) {
      return ErrorHandler("Already Booked", 400, req, res);
    }

    const newBooking = await bookAccomm.create({
      user: currentUser,
      accomodationsId: accomodationId,
      // bookingDate: {
      //   startDate,
      //   endDate,
      // },
      phoneNumber,
      startDate,
      endDate,
      checkIn,
      checkOut,
      capacity,
      subTotal,
    });

    await newBooking.save();

    return SuccessHandler(
      { success: true, message: "Booking Added successfully", newBooking },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getUserBookings = async (req, res) => {
  const currentUser = req.user._id;
  // #swagger.tags = ['booking']
  try {
    const bookings = await bookAccomm
      .find({ user: currentUser })
      .populate("accomodationsId");
    console.log(bookings);
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

module.exports = {
  bookNewAccomm,
  getUserBookings,
};
