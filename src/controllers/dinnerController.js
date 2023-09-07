const Accommodation = require("../models/Accommodation/accommodation");
const Meal = require("../models/Meal/meal");
const Dinner = require("../models/Accommodation/dinner");

const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");

// Create Dinner
const createDinner = async (req, res) => {
  // #swagger.tags = ['dinner']
  const currentUser = req.user._id;

  try {
    const { meals, dinnerDate, price, noOfPerson } = req.body;

    const isDinner = await Dinner.find({
      isActive: true,
      host: currentUser,
      date: { $lte: dinnerDate },
    });
    if (isDinner) {
      return ErrorHandler(
        "You already have an active dinner for the same day or before.",
        400,
        req,
        res
      );
    }
    let createdMeals = [];
    if (meals && Array.isArray(meals) && meals.length > 0) {
      createdMeals = await Dinner.insertMany(
        meals.map((val) => {
          return {
            ...val,
            host: currentUser,
          };
        })
      );
    }
    const dinner = await Dinner.create({
      meals: createdMeals.map((val) => val._id),
      host: currentUser,
      date: dinnerDate,
      price,
      noOfPerson,
    });

    return SuccessHandler(
      {
        message: "Created Dinner successfully",
        dinner,
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = {
  createDinner,
};
