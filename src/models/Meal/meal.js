const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dotenv = require("dotenv");
dotenv.config({ path: ".././src/config/config.env" });

const mealSchema = new Schema({

    createdBy: { type: String },
  dishName: { type: String, required: true },
  desc: { type: String },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  images: {type: [String], default: "https://img.freepik.com/free-photo/chicken-skewers-with-slices-sweet-peppers-dill_2829-18813.jpg?size=626&ext=jpg"},
  spiceStatus: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium",
  },
  gram: { type: Number, default: true },
  calories : { type: Number, default: true },

  maxServingCapacity: { type: Number, default: 3 },
  
  isActive: { type: Boolean, default: true },




}, {timestamps: true});

const meal = mongoose.model("Meal", mealSchema);

module.exports = meal;
  