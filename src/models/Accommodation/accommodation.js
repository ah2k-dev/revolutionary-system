const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dotenv = require("dotenv");
dotenv.config({ path: ".././src/config/config.env" });
const validator = require("validator");

const accommodationSchema = new Schema(
  {
    host: { type: Schema.Types.ObjectId, ref: "User", required: true },

    title: { type: String, require: true },
    desc: { type: String, require: true },
    images: {
      type: [String],
      require: true,
      // default:
      //   "https://img.freepik.com/free-photo/chicken-skewers-with-slices-sweet-peppers-dill_2829-18813.jpg?size=626&ext=jpg",
    },
    roomPrice: { type: Number },
    dinnerPrice: { type: Number },

    location: {
      type: { type: String, default: "Point" },
      coordinates: [Number],
    },
    roomCapacity: { type: Number, require: true },
    dinnerCapacity: { type: Number, require: true },

    services: { type: [String] },

    isActive: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["Booked", "Available"],
      default: "Available",
    },
    rating: { type: Number, default: 0 },
    reviewsId: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);
accommodationSchema.index({ location: "2dsphere" });
const accommodation = mongoose.model("Accommodation", accommodationSchema);
module.exports = accommodation;
