const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dotenv = require("dotenv");
dotenv.config({ path: ".././src/config/config.env" });
const validator = require("validator");

const couponSchema = new Schema(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    user: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    // meal: {type: Schema.Types.ObjectId, ref: "Meal"},
    // accomodation: {type: Schema.Types.ObjectId, ref: "Accomodation"},
    // maxCoupon: {type: Number, require: true},
    discount: {
      type: Number,
      require: true,
      validate: {
        validator: (value) =>
          validator.isFloat(String(value), { min: 0, max: 100 }),
        message: "Discount must be less than 100%",
      },
    },

    couponCode: { type: String, require: true },
    expiryDate: { type: Date, require: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
