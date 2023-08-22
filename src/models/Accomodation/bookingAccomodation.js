const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dotenv = require("dotenv");
dotenv.config({ path: ".././src/config/config.env" });
const validator = require("validator");

const bookingAccomodationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    accomodationsId: [
      { type: Schema.Types.ObjectId, ref: "Accomodation", required: true },
    ],
    status: {
      type: String,
      enum: ["current", "previous", "cancelled"],
      default: "current",
    },

    bookingDate: [
      {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
      },
    ],

    checkIn: { type: String, required: true  },
    checkOut: { type: String, required: true },
    capacity: { type: Number, required: true},

    stripeCharges: { type: Number, default: 0 },
    subTotal: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const bookingAccomodation = mongoose.model(
  "BookingAccomodation",
  bookingAccomodationSchema
);

module.exports = bookingAccomodation;
