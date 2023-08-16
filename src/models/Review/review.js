const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dotenv = require("dotenv");
dotenv.config({ path: ".././src/config/config.env" });
const validator = require('validator');



const reviewsSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: {
      type: Number,
      required: true,
      validate: {
        validator: (value) => validator.isFloat(String(value), { min: 0, max: 5 }),
        message: "Ratings must be between 0 and 5.",
      },
    },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewsSchema);

module.exports = Review;
