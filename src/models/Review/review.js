const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dotenv = require("dotenv");
dotenv.config({ path: ".././src/config/config.env" });

const reviewsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "accomodation",
      required: true,
    },
    ratings: {
      type: Number,
      required: true,
      validate: {
        validator: (value) => validator.isFloat(value, { min: 0, max: 5 }),
        message: "Ratings must be between 0 and 5.",
      },
    },
    comments: { type: String, required: true },
  },
  { timestamps: true }
);

const reviews = mongoose.model("reviews", reviewsSchema);

module.exports = reviews;
