const Meal = require("../models/Meal/meal");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const path = require("path");
const OrderMeal = require('../models/Meal/orderMeal')

//Create Meal
const createMeal = async (req, res) => {
  // #swagger.tags = ['meal']
  // TODO: image array
  try {
    const {
      dishName,
      desc,
      price,
      gram,
      calories,
      maxServingCapacity,
    } = req.body;

    const cookId = req.user._id;
    const isMealExist = await Meal.findOne({
      dishName,
      cook: cookId,
    });

    if (isMealExist) {
      return ErrorHandler(
        "Meal already exist, Please add new meals",
        400,
        req,
        res
      );
    }

    const newMeal = await Meal.create({
      cook: cookId,
      dishName,
      desc,
      price,
      gram,
      calories,
      maxServingCapacity,
    });

    return SuccessHandler(
      { message: "Meal Added successfully", newMeal },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

// getting Meals

const getMeals = async (req, res) => {
  // #swagger.tags = ['meal']
  // TODO: image array
  try {
    // Price Filter

    const priceFilter = req.body.price
      ? {
          price: { $lte: Number(req.body.price), $gte: Number(req.body.price) },
        }
      : {};

    // Dish Filter
    const dishFilter = req.body.dishName
      ? {
         
          dishName: {
            $regex: req.body.dishName, $options: 'i'
          }
        }
      : {};

    // servingCapacityFilter
    const servingCapacityFilter = req.body.maxServingCapacity
      ? {
          maxServingCapacity: Number(req.body.maxServingCapacity),
        }
      : {};

    // Spice Status Filter
    const spiceStatusFilter = req.body.spiceStatus
      ? {
          spiceStatus: { $eq: req.body.spiceStatus },
        }
      : {};

    // Gram Filter
    const gramFilter = req.body.gram
      ? {
          gram: { $lte: Number(req.body.gram) },
        }
      : {};

    // Calories Filter
    const caloriesFilter = req.body.calories
      ? {
          calories: { $lte: Number(req.body.calories) },
        }
      : {};

    const meals = await Meal.find({
      isActive: true,
      ...dishFilter,
      ...priceFilter,
      ...servingCapacityFilter,
      ...spiceStatusFilter,
      ...gramFilter,
      ...caloriesFilter,
    });

    if (!meals) {
      return ErrorHandler("Meals Does not exist", 400, req, res);
    }
    const mealsCount = meals.length;

    return SuccessHandler(
      { message: "Meal Added successfully", mealsCount, meals },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};




// get Meals by Cook ID
const getMealsByCookId = async(req, res)=>{
  // #swagger.tags = ['meal']
  try {
    const meals = await Meal.find({cook:req.params.id})
    if (!meals) {
      return ErrorHandler(
        "Sorry, The Cook's Meal doesn't exist",
        400,
        req,
        res
      );
    }
    const totalMeals = meals.length
    return SuccessHandler(
      { message: "Fetched Cook Meals successfully",totalMeals, meals },
      200,
      res
    );
    
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res)
  }

}



// Order the meal
const orderTheMeal = async (req, res) => {
   // #swagger.tags = ['meal']
  const currentUser = req.user._id;
  try {
    const { meals, subTotal } = req.body;

    if (req.user.role === "user") {
      // const order = await OrderMeal.findById();

      const order = await OrderMeal.create({
        user: currentUser,
        meals,
        subTotal,
      });

      await order.save();

      return SuccessHandler(
        { message: "Meal's Order Created successfully", order },
        200,
        res
      );
    } else {
      return ErrorHandler("Unauthorized User", 400, req, res);
    }
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};


module.exports = {
  createMeal,
  getMeals,
  getMealsByCookId,
  orderTheMeal,
};
