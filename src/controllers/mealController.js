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
      gram,
      calories,
      maxServingCapacity,
      latitude,
      longitude,
      } = req.body;

    const cookId = req.user._id;
    const isMealExist = await Meal.findOne({
        dishName,
      createdBy: cookId,
    });

    if (isMealExist) {
      return ErrorHandler("Meal already exist, Please add new meals", 400, req, res);
    }

    const newMeal = await Meal.create({
        createdBy: cookId,
        dishName,
        desc,
        price,
        gram,
        calories,
        maxServingCapacity,
        location: {
          type: "Point",
          coordinates: [latitude, longitude],
        },
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
     
       const priceFilter = req.body.price ? 
       {
        price: {$lte: Number(req.body.price), $gte: Number(req.body.price)} 

       }:{}




      // Dish Filter
      const dishFilter = req.body.dishName
      ? {
        dishName: {
            $regex: new RegExp(req.body.dishName, 'i'), // Case-insensitive search
          },
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
          spiceStatus: {$eq: req.body.spiceStatus},
           }
         : {};


            // Gram Filter
      const gramFilter = req.body.gram
      ? {
        gram: {$lte: Number(req.body.gram)},
        }
      : {};


                  // Calories Filter
                  const caloriesFilter = req.body.calories
                  ? {
                    calories: {$lte: Number(req.body.calories)},
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
