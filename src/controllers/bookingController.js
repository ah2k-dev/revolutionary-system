const Accommodation = require("../models/Accommodation/accommodation");
const Booking = require("../models/Accommodation/booking");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const cron = require("node-cron");
//Create Booking
const createBooking = async (req, res) => {
  // #swagger.tags = ['booking']
  const currentUser = req.user._id;
  const accommodationId = req.params.id;
  try {
    const { startDate, endDate, roomsBooked, dinnerSeats } = req.body;

    // roomBook should not be greater than dinnerSeats
    const accommodation = await Accommodation.findById(accommodationId);
    if (!accommodation) {
      return ErrorHandler("Accommodation doesn't already exist", 400, req, res);
    }
    const eDate = new Date(Date.parse(req.body.endDate));
    const sDate = new Date(Date.parse(req.body.startDate));
    console.log("eDate", eDate);

    const timeDifference = new Date(eDate.getTime() - sDate.getTime());
    const numberOfDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    console.log("numberOfDays", numberOfDays);
    console.log("timeDifference", timeDifference);

    const accommodationTotal =
      accommodation.roomPrice * roomsBooked * numberOfDays;
    console.log(accommodation.roomPrice);
    const dinnerTotal = accommodation.dinnerPrice * dinnerSeats * numberOfDays;

    // if (roomsBooked > dinnerSeats) {
    //   return ErrorHandler(
    //     "The Rooms shouldn't be greater than Dinner Seats",
    //     400,
    //     req,
    //     res
    //   );
    // }

    if (roomsBooked > accommodation.availableRoomCapacity) {
      return ErrorHandler(
        "Rooms in the accommodation are currently unavailable.",
        400,
        req,
        res
      );
    }

    if (dinnerSeats > accommodation.availableDinnerCapacity) {
      return ErrorHandler(
        "The dinner seating is currently unavailable.",
        400,
        req,
        res
      );
    }

    const booking = await Booking.create({
      user: currentUser,
      accommodation: accommodationId,
      dinnerTotal: dinnerTotal,
      accommodationTotal: accommodationTotal,
      roomsBooked,
      dinnerSeats,
      startDate,
      endDate,
      subTotal: accommodationTotal + dinnerTotal,
    });

    await Accommodation.findByIdAndUpdate(accommodationId, {
      $set: {
        availableRoomCapacity:
          accommodation.availableRoomCapacity - roomsBooked,
        availableDinnerCapacity:
          accommodation.availableDinnerCapacity - dinnerSeats,
      },
    });
    const updatedAccommodation = await Accommodation.findById(accommodationId);

    if (updatedAccommodation.availableRoomCapacity === 0) {
      // Update the status to "Booked"
      await Accommodation.findByIdAndUpdate(accommodationId, {
        $set: {
          status: "Booked",
        },
      });
    }

    return SuccessHandler(
      { message: "Booking Created successfully", booking },
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

      await Accommodation.findByIdAndUpdate(booking.accommodation, {
        $inc: {
          availableDinnerCapacity: booking.dinnerSeats,
          availableRoomCapacity: booking.roomsBooked,
        },
      });

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

// make the booking completed when they reach their end date
const expiredTheBooking = async (req, res) => {
  // #swagger.tags = ['booking']
  const booking = await Booking.find({
    isActive: true,
  });
  console.log(booking);
  try {
    return SuccessHandler(
      { message: "Booking Created successfully", booking },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
// cron.schedule("*59 23 * * *", expiredTheBooking)

module.exports = {
  createBooking,
  expiredTheBooking,
  cancelTheBooking,
};
