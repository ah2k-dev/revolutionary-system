const orderMeal = require("../models/OrderMeal/orderMeal");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const Meal = require("../models/Meal/meal");
const path = require("path");

//Add Meal in Cart
const addMealInCart = async (req, res) => {
  const currentUser = req.user._id
  try {
    const mealId = req.params.id;
    const { 
        quantity

     } = req.body;
     
    if (req.user.role === "user") {
      const isMealExist = await Meal.findById(mealId); 

      if (!isMealExist) {
        return ErrorHandler("Meal Does not exist", 400, req, res);
      }

    // isBooked.accomodationsId.includes(accodID)

    const addMeal = await bookAccomm.create({
      userId: currentUser,
      quantity,
    })

    await addMeal.save()

      return SuccessHandler(
        { message: "Meal Added in Cart", addMeal },
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


const getMealsInCart = async (req, res) => {
  const currentUser = req.user._id
  try {
    if (req.user.role === "user") {
      const userMeals = await Cart.findById({userId: currentUser}); 

      if (!userMeals) {
        return ErrorHandler("Please add Meal in your Cart", 400, req, res);
      }

      return SuccessHandler(
        { message: "Fetched Successfully", userMeals },
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
    addMealInCart,
    getMealsInCart,
};
