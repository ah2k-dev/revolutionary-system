const Review = require("../models/Reviews/review");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const Meal = require("../models/Meal/meal");
const Coupon = require("../models/Coupon/coupon");
const OrderMeal = require("../models/Meal/orderMeal");
// Cook Meals
const getMeals = async (req, res) => {
  // #swagger.tags = ['cook']
  const currentUser = req.user._id;
  try {
    const meals = await Meal.find({
      isActive: true,
      cook: currentUser,
    });
    if (!meals) {
      return ErrorHandler("Meals not found", 404, req, res);
    }

    return SuccessHandler(
      {
        message: "Meals fetched successfully",
        baseUrl: `${process.env.BASE_URL}/uploads/`,
        meals,
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

// get all coupons for cook
//Get Coupons
const getCoupons = async (req, res) => {
  // #swagger.tags = ['cook']
  try {
    const currentUser = req.user._id;
    const coupons = await Coupon.find({
      createdBy: currentUser,
    });

    if (!coupons) {
      return ErrorHandler("Coupons not found", 404, req, res);
    }

    return SuccessHandler(
      { message: "Coupon Fetched successfully", coupons },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const providePickupDate = async (req, res) => {
  // #swagger.tags = ['cook']
  const currentUser = req.user._id;
  const { orderId } = req.params;
  const { PickupDate } = req.body;
  try {
    if (new Date(PickupDate) <= new Date()) {
      return ErrorHandler("Pickup Date should be in future", 400, req, res);
    }

    const order = await OrderMeal.findOne({
      _id: orderId,
      user: currentUser,
      status: "pending",
    });
    if (!order) {
      return ErrorHandler("No Such Purchased Meal exist", 404, req, res);
    }
    await OrderMeal.findOneAndUpdate(
      { _id: orderId },
      {
        $set: {
          status: "approved",
          PickupDate,
        },
      }
    );

    return SuccessHandler(
      {
        message: `The Pickup date: ${PickupDate} is provided by cook for that purchase meals`,
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
module.exports = {
  getMeals,
  getCoupons,
  providePickupDate,
};
