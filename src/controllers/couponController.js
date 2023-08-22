const Meal = require("../models/Meal/meal");
const OrderMeal = require("../models/Meal/orderMeal");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const path = require("path");
const Review = require("../models/Reviews/review");
const Coupon = require("../models/Coupon/coupon");

//Create Coupon
const createCoupon = async (req, res) => {
  // #swagger.tags = ['coupon']
  try {
    const { couponTitle, discount, couponCode, expiryDate } = req.body;

    const currentUser = req.user._id;
    const isCoupon = await Coupon.findOne({
      couponCode,
      createdBy: currentUser,
    });

    if (isCoupon) {
      return ErrorHandler("Coupon already exist", 400, req, res);
    }

    if (new Date(expiryDate) <= new Date()) {
      return ErrorHandler("Expiry date should be in future", 400, req, res);
    }

    const isValidCoupon = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/.test(
      couponCode
    );
    if (!isValidCoupon) {
      return ErrorHandler("Coupon must contain number and text", 400, req, res);
    }

    const newCoupon = await Coupon.create({
      couponTitle,
      discount: Number(discount) / 100,
      couponCode,
      createdBy: currentUser,
      expiryDate,
    });

    await newCoupon.save();

    return SuccessHandler(
      { success: true, message: "Coupon Added successfully", newCoupon },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

// verify meals and GIve Dicount
const verifyCoupon = async (req, res) => {
  // #swagger.tags = ['coupon']
  try {
    const { couponCode, createdBy } = req.body;
    const currentUser = req.user._id;
    const coupon = await Coupon.findOne({
      couponCode,
      isActive: true,
      createdBy,
      expiryDate: { $gt: new Date() },
      user: { $nin: [currentUser] },
    });
    if (!coupon) {
      return ErrorHandler("Coupon is not valid.", 404, req, res);
    }

    return SuccessHandler(
      { success: true, message: "Coupon Verified successfully", coupon },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = {
  createCoupon,
  verifyCoupon,
};
