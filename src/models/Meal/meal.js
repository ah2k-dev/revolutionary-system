const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dotenv = require("dotenv");
dotenv.config({ path: ".././src/config/config.env" });

const mealSchema = new Schema(
  {
    reviewsId: [{ type: Schema.Types.ObjectId, ref: "Review" }],

    // new fields
    mealType: {
      type: String,
      enum: ["cook", "accomodation"],
      default: "cook",
    },

    cook: { type: Schema.Types.ObjectId, ref: "User" },
    dishName: { type: String, },
    desc: { type: String,  },
    price: { type: Number,  },
    images: {
      type: [String],
      default:
        "https://img.freepik.com/free-photo/chicken-skewers-with-slices-sweet-peppers-dill_2829-18813.jpg?size=626&ext=jpg",
    },
    spiceStatus: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },
    gram: { type: Number,  },
    calories: { type: Number, },

    maxServingCapacity: { type: Number },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
const meal = mongoose.model("Meal", mealSchema);

module.exports = meal;
