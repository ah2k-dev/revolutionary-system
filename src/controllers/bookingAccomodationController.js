const bookAccomm = require("../models/BookingAccomodation/bookingAccomodation");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const Accomodation = require("../models/Accomodation/accomodation");
const path = require("path");

//Book a new Accomm
const bookNewAccomm = async (req, res) => {
  const currentUser = req.user._id;
  try {
    const accomodationId = req.params.id;
    const { startDate, endDate, subTotal } = req.body;

    if (req.user.role === "user") {
      const currentAccommodation = await Accomodation.findById(accomodationId);

      if (!currentAccommodation) {
        return ErrorHandler("Accommodation Does not exist", 400, req, res);
      }

      // let stripeChargesInPercent = 0.3
      // let stripeChargesAmount = stripeChargesInPercent*100
      // let totalAmount = (stripeChargesAmount)+  subTotal

      const isBooked = await bookAccomm.findOne({
        accomodationsId: accomodationId,
      });
      if (isBooked) {
        return ErrorHandler("Already Booked", 400, req, res);
      }
      // isBooked.accomodationsId.includes(accodID)

      const newBooking = await bookAccomm.create({
        user: currentUser,
        accomodationsId: [accomodationId],
        bookingDate: {
          startDate,
          endDate,
        },
        subTotal,
      });

      await newBooking.save();

      return SuccessHandler(
        { message: "Booking Added successfully", newBooking },
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

const getUserBookings = async (req, res) => {
  const currentUser = req.user._id;
  // #swagger.tags = ['booking']
  try {
    if (req.user.role === "user") {
      const bookings = await bookAccomm.find({ user: currentUser });
      console.log(bookings);
      //   if (!bookings) {
      //     return ErrorHandler("No Such Booking exist", 400, req, res);
      //   }

      return SuccessHandler(
        { message: "Booking Fetched successfully", bookings },
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
  bookNewAccomm,
  getUserBookings,
};
