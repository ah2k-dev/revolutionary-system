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
      const { couponTitle, discount, couponCode, expiryDate } =
        req.body;
  
      const currentUser = req.user._id;
    //   const isMealExist = await Meal.find({
    //     _id: mealId,
    //     cook: currentUser,
    //   });
  
    //   if (!isMealExist) {
    //     return ErrorHandler("Your Meal not found", 404, req, res);
    //   }
  
      const isCoupon = await Coupon.findOne({
        meal: mealId,
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
  const verifyCouponsAndGiveDiscount = async (req, res) => {
    // #swagger.tags = ['meal']
    try {
      const { couponCode, selectedMeals } = req.body;
      const coupon = await Coupon.findOne({
        couponCode,
        isActive: true,
        expiryDate: { $gt: new Date() },
      });
      if (!coupon) {
        return ErrorHandler("Coupon is not valid.", 404, req, res);
      }
  
      const applicableMeals = selectedMeals.filter(
        (mealId) => coupon.meal && coupon.meal.toString() === mealId
      );
  
      if (applicableMeals.length === 0) {
        return ErrorHandler(
          {
            success: false,
            message: "Coupon is not applicable to any selected meals.",
          },
          404,
          req,
          res
        );
      }
      // Calculate the total discount for applicable meals
      const totalDiscount = applicableMeals.reduce((acc, meal) => {
        return acc + meal.price * (coupon.discount / 100);
      }, 0);
  
      // Calculate the new total amount after applying the discount
      const newTotalAmount = orderTotal - totalDiscount;
  
      return SuccessHandler(
        { success: true, message: "Coupon Applied successfully", newTotalAmount },
        200,
        res
      );
    } catch (error) {
      return ErrorHandler(error.message, 500, req, res);
    }
  };



  module.exports = {
    createCoupon,
    verifyCouponsAndGiveDiscount,
  };
  