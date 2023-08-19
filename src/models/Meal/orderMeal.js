const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dotenv = require("dotenv");
dotenv.config({ path: ".././src/config/config.env" });
const validator = require("validator");

const orderMealSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    meals: [
      {
        meal: { type: Schema.Types.ObjectId, ref: "Meal", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],

    subTotal: { type: Number, required: true },
    totalAmount: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["current", "previous", "cancelled"],
      default: "current",
    },

    orderDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const orderMeal = mongoose.model("OrderMeal", orderMealSchema);

module.exports = orderMeal;
