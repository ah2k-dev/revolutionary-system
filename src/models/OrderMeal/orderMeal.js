const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dotenv = require("dotenv");
dotenv.config({ path: ".././src/config/config.env" });
const validator = require("validator");

const orderMealSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    mealId: [{ type: Schema.Types.ObjectId, ref: 'Meal',  required: true}], 

    status: {
      type: String,
      enum: ["current", "previous", "cancelled"],
      default: "current",
    },

    bookingDate: { type: Date, required: true },
    bookingDate: { type: Date, required: true },

    subTotal: {type: Number, default: 0},
    totalAmount: {type: Number, default: 0},
    
  },
  { timestamps: true }
);

const orderMeal = mongoose.model("OrderMeal", orderMealSchema);

module.exports = orderMeal;
