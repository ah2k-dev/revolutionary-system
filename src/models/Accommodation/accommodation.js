const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dotenv = require("dotenv");
dotenv.config({ path: ".././src/config/config.env" });
const validator = require("validator");

const accommodationSchema = new Schema(
  {
    host: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reviewsId: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    meals: [{ type: Schema.Types.ObjectId, ref: "Meal" }],

    title: { type: String, require: true },
    desc: { type: String, require: true },
    images: {
      type: [String],
      default:
        "https://img.freepik.com/free-photo/chicken-skewers-with-slices-sweet-peppers-dill_2829-18813.jpg?size=626&ext=jpg",
    },
    price: { type: Number, require: true },
    location: {
      type: { type: String, default: "Point" },
      coordinates: [Number],
    },
    capacity: { type: Number, require: true },
    services: { type: [String] },
    rating: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
accommodationSchema.index({ location: "2dsphere" });
const Accommodation = mongoose.model("Accommodation", accommodationSchema);
module.exports = Accommodation;