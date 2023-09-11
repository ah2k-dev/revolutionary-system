const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dotenv = require("dotenv");
dotenv.config({ path: ".././src/config/config.env" });
const validator = require("validator");

const reviewsSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    accommodation: { type: Schema.Types.ObjectId, ref: "Accommodation" },
    // below field updated
    cook: { type: Schema.Types.ObjectId, ref: "User" },

    rating: {
      type: Number,
      required: true,
      validate: {
        validator: (value) =>
          validator.isFloat(String(value), { min: 1, max: 5 }),
        message: "Ratings must be between 1 and 5.",
      },
    },
    comment: { type: String },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewsSchema);

module.exports = Review;
