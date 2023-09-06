const Accommodation = require("../models/Accommodation/accommodation");
const Booking = require("../models/Accommodation/booking");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
//Create Booking
const createBooking = async (req, res) => {
  // #swagger.tags = ['booking']
  const currentUser = req.user._id;
  const accommodationId = req.params.id;
  try {
    const { noOfPersons, date, accommodationSelected } = req.body;

    const accommodation = await Accommodation.findById(accommodationId);
    const accommodationTotal = accommodation.accommodationPrice * noOfPersons;
    const dinnerTotal = accommodation.dinnerPrice * noOfPersons;

    if (!accommodation) {
      return ErrorHandler("Accommodation doesn't already exist", 400, req, res);
    }
    if (accommodation.capacity < noOfPersons) {
      return ErrorHandler(
        "Oops Accommodation or Dinner cann't be booked for the given date"
      );
    }

    const booking = await Booking.create({
      user: currentUser,
      accommodation: accommodationId,
      accommodationSelected,
      noOfPersons,
      accommodationAmount: accommodationTotal,
      dinner: dinnerTotal,
      date,
    });
    await Accommodation.findByIdAndUpdate(accommodationId, {
      $set: { capacity: accommodation.capacity - noOfPersons },
    });

    return SuccessHandler(
      { message: "Booking Created successfully", booking },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = {
  createBooking,
};
