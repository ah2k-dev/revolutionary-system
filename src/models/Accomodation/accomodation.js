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

    createdBy: { type: String },
    services: { type: [String] },
    images: {
      type: [String],
      default:
        "https://images.pexels.com/photos/1697076/pexels-photo-1697076.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

accomodationSchema.index({ location: "2dsphere" });

const Accomodation = mongoose.model("Accomodation", accomodationSchema);

module.exports = Accomodation;
