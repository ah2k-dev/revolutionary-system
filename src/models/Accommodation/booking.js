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
    date: { type: Date },
    accommodationAmount: { type: Number, default: 0 },
    dinner: { type: Number, default: 0 },
    subTotal: { type: Number },
    totalAmount: { type: Number },
    expiryDate: { type: Date },
    isActive: { type: Boolean, default: true },
    accommodationSelected: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const booking = mongoose.model("Booking", bookingSchema);
module.exports = booking;
