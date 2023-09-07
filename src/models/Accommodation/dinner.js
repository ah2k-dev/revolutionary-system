const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dotenv = require("dotenv");
dotenv.config({ path: ".././src/config/config.env" });
const validator = require("validator");

const dinnerSchema = new Schema(
  {
    host: { type: Schema.Types.ObjectId, ref: "User", required: true },
    meals: [{ type: Schema.Types.ObjectId, ref: "Meal" }],
    date: { type: Date, default: Date.now },
    price: { type: Number, require: true },
    noOfPerson: {
      type: Number,
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
const dinner = mongoose.model("Dinner", dinnerSchema);
module.exports = dinner;
