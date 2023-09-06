const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dotenv = require("dotenv");
dotenv.config({ path: ".././src/config/config.env" });
const validator = require("validator");

const bookingSchema = new Schema(
  {
    accommodation: { type: Schema.Types.ObjectId, ref: "User" },
    user: { type: Schema.Types.ObjectId, ref: "User" },

    status: {
      type: String,
      enum: ["booked", "previous", "cancelled", "completed"],
      default: "booked",
    },
    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },
    subTotal: { type: Number },

    totalAmount: { type: Number },
    expiryDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
const booking = mongoose.model("Booking", bookingSchema);
module.exports = booking;
