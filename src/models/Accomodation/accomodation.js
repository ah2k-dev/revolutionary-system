const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dotenv = require("dotenv");
dotenv.config({ path: ".././src/config/config.env" });

const accomodationSchema = new Schema(
  {
    reviewsId: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    meals: [{ type: Schema.Types.ObjectId, ref: "Meal" }],

    price: { type: Number, required: true },

    title: { type: String, required: true },
    desc: { type: String, required: true },
    capacity: { type: Number, required: true },

    location: {
      type: { type: String, default: "Point" },
      coordinates: [Number],
    },

    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    services: { type: [String] },
    images: {
      type: [String],
      default:
        "https://img.freepik.com/free-photo/chicken-skewers-with-slices-sweet-peppers-dill_2829-18813.jpg?size=626&ext=jpg",
    },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    // new field added
    tag: {
      type: String,
      enum: ["sponsored", "non-sponsored"],
      default: "non-sponsored",
    },
  },
  { timestamps: true }
);

accomodationSchema.index({ location: "2dsphere" });

const Accomodation = mongoose.model("Accomodation", accomodationSchema);

module.exports = Accomodation;
