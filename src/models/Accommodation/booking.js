const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dotenv = require("dotenv");
dotenv.config({ path: ".././src/config/config.env" });
const validator = require("validator");

const bookingSchema = new Schema(
  {
    accommodation: { type: Schema.Types.ObjectId, ref: "Accommodation" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["booked", "previous", "cancelled", "completed"],
      default: "booked",
    },
    dinnerSeats: { type: Number, default: 0 },
    roomsBooked: { type: Number, default: 0 },
    accommodationTotal: { type: Number, default: 0 },
    dinnerTotal: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    subTotal: { type: Number },
    totalAmount: { type: Number },
    isActive: { type: Boolean, default: true },
    noOfPerson: {type: Number}
  },
  { timestamps: true }
);
const booking = mongoose.model("Booking", bookingSchema);
module.exports = booking;
