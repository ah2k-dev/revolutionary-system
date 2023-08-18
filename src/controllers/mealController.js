const Meal = require("../models/Meal/meal");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const path = require("path");

//Create Meal
const createMeal = async (req, res) => {
  // #swagger.tags = ['meal']
  // TODO: image array
  try {
    const {
        dishName,
      desc,
      price,
      quantity,
      gram,
      calories,
      maxServingCapacity,
      } = req.body;

    const cookId = req.user._id;
    const isMealExist = await Meal.findOne({
        dishName,
      createdBy: cookId,
    });

    if (isMealExist) {
      return ErrorHandler("Meal already exist", 400, req, res);
    }

    const newMeal = await Meal.create({
        createdBy: cookId,
      dishName,
      desc,
      price,
      quantity,
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
  
      const cookId = req.user._id;
      const meals = await Meal.find();
  
      if (!meals) {
        return ErrorHandler("Meals Does not exist", 400, req, res);
      }
      const mealsCount = meals.length

  
  
      return SuccessHandler(
        { message: "Meal Added successfully", mealsCount, meals },
        200,
        res
      );
    } catch (error) {
      return ErrorHandler(error.message, 500, req, res);
    }
  };





module.exports = {
  createMeal,
  getMeals,
};
