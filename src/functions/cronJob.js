const Booking = require("../models/Accommodation/booking");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const completeTheBooking = async (req, res) => {
  try {
    const currentDate = new Date();
    // const booking = await Booking.find({
    //   isActive: true,
    // });
    // booking.map((bookings) => currentDate > bookings.endDate);
    const booking = await Booking.aggregate([
      {
        $match: {
          isActive: true,
          endDate: { $lt: currentDate },
        },
      },
      {
        $set: { status: "completed" },
      },
    ]);

    console.log(booking);
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
  completeTheBooking,
};
