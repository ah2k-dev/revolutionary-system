const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dotenv = require("dotenv");
dotenv.config({ path: ".././src/config/config.env" });
const validator = require("validator");

const accommodationSchema = new Schema(
  {
    host: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // dinner: [{ type: Schema.Types.ObjectId, ref: "Dinner" }],

    title: { type: String, require: true },
    desc: { type: String, require: true },
    images: {
      type: [String],
      default:
        "https://img.freepik.com/free-photo/chicken-skewers-with-slices-sweet-peppers-dill_2829-18813.jpg?size=626&ext=jpg",
    },
    price: { type: Number, require: true },
    // dinnerPrice: { type: Number, require: true },
    location: {
      type: { type: String, default: "Point" },
      coordinates: [Number],
    },
    rooms: { type: Number, require: true },
    services: { type: [String] },
    isActive: { type: Boolean, default: true },

    availableSeats: { type: Number },
    // accommodationSelected: { type: Boolean, default: false },
  },
  { timestamps: true }
);
accommodationSchema.index({ location: "2dsphere" });
const accommodation = mongoose.model("Accommodation", accommodationSchema);
module.exports = accommodation;
