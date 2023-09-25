const Booking = require("../models/Accommodation/booking");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const { sendNotification } = require("../functions/notification");
const completeTheBooking = async (req, res) => {
  try {
    const currentDate = new Date();
    // const booking = await Booking.find({
    //   isActive: true,
    // });
    // booking.map((bookings) => currentDate > bookings.endDate);
    // const booking = await Booking.aggregate([
    //   {
    //     $match: {
    //       isActive: true,
    //       endDate: { $lt: currentDate },
    //     },
    //   },
    //   {
    //     $set: { status: "completed", isActive: false },
    //   },
    // ]);
    const booking = await Booking.find({
      $match: { status: "active", endDate: { $lt: currentDate } },
    });
    Promise.all(
      booking.map(async (val) => {
        // const completedBookings = await Booking.findOneAndUpdate({
        //   $set:{status: "completed"}
        // })
        val.status = "completed";
        await val.save();
        sendNotification(
          "Booking Completed",
          "Please add a review for your booking and facility.",
          val.user,
          val._id
        );
      })
    )
      .then((result) => {
        console.log(result);
        return SuccessHandler(
          {
            message: "Booking Status Changed successfully!",
            booking,
          },
          200,
          res
        );
      })
      .catch((error) => {
        return ErrorHandler(error.message, 500, req, res);
      });
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = {
  completeTheBooking,
};
