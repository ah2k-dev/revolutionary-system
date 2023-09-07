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
    const { startDate, endDate, roomsBooked, dinnerSeats, subTotal } = req.body;
    // roomBook should not be greater than dinnerSeats
    const accommodation = await Accommodation.findById(accommodationId);
    const accommodationTotal = accommodation.roomPrice * roomsBooked;
    const dinnerTotal = accommodation.dinnerPrice * dinnerSeats;

    if (!accommodation) {
      return ErrorHandler("Accommodation doesn't already exist", 400, req, res);
    }
    if (roomsBooked > dinnerSeats) {
      return ErrorHandler("The Rooms shouldn't be greater than Dinner Seats");
    }

    if (accommodation.availableRoomCapacity < roomsBooked) {
      return ErrorHandler(
        "Rooms in the accommodation are currently unavailable."
      );
    }

    if (accommodation.availableDinnerCapacity < dinnerSeats) {
      return ErrorHandler("The dinner seating is currently unavailable.");
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
      subTotal: accommodationId + dinnerTotal,
    });
    await Accommodation.findByIdAndUpdate(accommodationId, {
      $set: {
        availableRoomCapacity:
          accommodation.availableRoomCapacity - roomsBooked,
        availableDinnerCapacity:
          accommodation.availableDinnerCapacity - dinnerSeats,
      },
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
