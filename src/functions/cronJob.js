const Booking = require("../models/Accommodation/booking");
const { sendNotification } = require("../functions/notification");
const completeTheBooking = async () => {
  try {
    const currentDate = new Date();
    const booking = await Booking.find({
      status: "active",
      endDate: { $lt: currentDate },
    });
    // console.log(booking);
    if (booking.length > 0) {
      console.log("bookingsssssssssssssssssssss", booking);
      const promise = booking.map(async (val) => {
        if (val.status === "active") {
          val.status = "completed";
          await val.save();
          sendNotification(
            "Booking Completed",
            "Please add a review for your booking and facility.",
            val.user,
            val._id
          );
        }
      });
      await Promise.all(promise);
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  completeTheBooking,
};
