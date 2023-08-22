const Meal = require("../models/Meal/meal");
const OrderMeal = require("../models/Meal/orderMeal");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const path = require("path");
const Review = require("../models/Reviews/review");
const Coupon = require("../models/Coupon/coupon")


//Create Meal
const createMeal = async (req, res) => {
  // #swagger.tags = ['meal']
  // TODO: image array
  try {
    const { dishName, desc, price, gram, calories, maxServingCapacity } =
      req.body;

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
  try {
    // const { minPrice } = req.query;
    // const { maxPrice } = req.query;
    // const priceFilter = {
    //   price: { $lte: Number(maxPrice), $gte: Number(minPrice) },
    // };

    //✅ Price Filter
    const priceFilter =
      req.body.maxPrice && req.body.minPrice
        ? {
            price: {
              $lte: Number(req.body.maxPrice),
              $gte: Number(req.body.minPrice),
            },
          }
        : {};

    //✅ Dish Filter
    const dishFilter = req.body.dishName
      ? {
          dishName: {
            $regex: req.body.dishName,
            $options: "i",
          },
        }
      : {};

    // ✅ servingCapacityFilter
    const servingCapacityFilter = req.body.maxServingCapacity
      ? {
          maxServingCapacity: Number(req.body.maxServingCapacity),
        }
      : {};

    // ✅ Spice Status Filter
    const spiceStatusFilter = req.body.spiceStatus
      ? {
          spiceStatus: { $eq: req.body.spiceStatus },
        }
      : {};

    // ✅  Gram Filter
    const gramFilter = req.body.gram
      ? {
          gram: { $lte: Number(req.body.gram) },
        }
      : {};

    //✅ Calories Filter
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
const getMealsByCookId = async (req, res) => {
  // #swagger.tags = ['meal']
  try {
    const meals = await Meal.find({ cook: req.params.id });
    if (!meals) {
      return ErrorHandler(
        "Sorry, The Cook's Meal doesn't exist",
        400,
        req,
        res
      );
    }
    const totalMeals = meals.length;
    return SuccessHandler(
      { message: "Fetched Cook Meals successfully", totalMeals, meals },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

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

// Get Ordered the meal
const getOrderedMeal = async (req, res) => {
  // #swagger.tags = ['meal']
  const currentUser = req.user._id;
  try {
    if (req.user.role === "user") {
      const userMeals = await OrderMeal.find({ user: currentUser }).populate(
        "meals.meal"
      );
      return SuccessHandler(
        { message: "Fetched user ordered meals successfully", userMeals },
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

// add reviews on Meal
const addReviews = async (req, res) => {
  const currentUser = req.user._id;
  // #swagger.tags = ['meal']
  try {
    const mealId = req.params.id;
    const { rating, comment } = req.body;
    if (req.user.role === "user") {
      const theMeal = await Meal.findById(mealId);
      if (!theMeal) {
        return ErrorHandler("The Meal doesn't exist", 400, req, res);
      }

      const existingReview = await Review.findOne({
        user: currentUser,
        meal: mealId,
        comment,
      });

      if (existingReview) {
        existingReview.rating = Number(rating);
        existingReview.comment = comment;
        await existingReview.save();
        return SuccessHandler(
          {
            success: true,
            message: "Review Updated successfully",
            review: existingReview,
          },
          200,
          res
        );
      } else {
        const review = await Review.create({
          rating: Number(rating),
          comment,
          user: currentUser,
          meal: mealId,
        });
        await review.save();
        await Meal.findByIdAndUpdate(mealId, {
          $push: { reviewsId: review._id },
        });
        return SuccessHandler(
          { success: true, message: "Review added successfully", review },
          200,
          res
        );
      }
    } else {
      return ErrorHandler("Unauthorized User", 400, req, res);
    }
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getReviews = async (req, res) => {
  const currentUser = req.user._id;
  // #swagger.tags = ['meal']
  try {
    const mealId = req.params.id;
    if (req.user.role === "user") {
      const meal = await Meal.findById(mealId).populate("reviewsId");
      if (!meal) {
        return ErrorHandler("The Meal doesn't exist", 400, req, res);
      }
      const reviews = meal.reviewsId;
      let totalRating = 0;
      for (let rev of reviews) {
        totalRating += rev.rating;
      }
      const avgRating = (totalRating / reviews.length).toFixed(1);
      return SuccessHandler(
        {
          success: true,
          message: "Fetched Reviews successfully",
          avgRating,
          reviews,
        },
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

const deleteReview = async (req, res) => {
  // #swagger.tags = ['meal']
  try {
    const { reviewId } = req.query;
    const mealId = req.params.id;

    if (req.user.role) {
      const review = await Review.findByIdAndDelete({
        _id: reviewId,
      });
      if (!review) {
        return ErrorHandler(
          { success: false, message: "Review not found or unauthorized" },
          404,
          req,
          res
        );
      }
      await Meal.findByIdAndUpdate(mealId, {
        $pull: { reviewsId: reviewId },
      });
      return SuccessHandler(
        { success: true, message: "Review has been Deleted" },
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






//Create Coupon 
const createCoupon = async (req, res) => {
  // #swagger.tags = ['meal']
  try {
    const { couponTitle, maxCoupon, discount, couponCode, expiryDate} =
      req.body;

    const currentUser = req.user._id;
    const mealId = req.params.id;
    const isMealExist = await Meal.find({
      _id: mealId,
      cook: currentUser
    });
  
      if (!isMealExist) {
        return ErrorHandler("Your Meal not found", 404, req, res);
      }

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

    const isValidCoupon = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/.test(couponCode);
    if (!isValidCoupon){
      return ErrorHandler("Coupon must contain number and text", 400, req, res);
  }


    const newCoupon = await Coupon.create({
        couponTitle,
        maxCoupon: Number(maxCoupon),
        discount: (Number(discount))/(100),
      couponCode,
      createdBy: currentUser,
      expiryDate,
      meal: mealId,
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
  // #swagger.tags = ['user']
  try {
    const { couponCode, selectedMeals } = req.body;
    const coupon = await Coupon.findOne({ couponCode, isActive: true, expiryDate: { $gt: new Date() } });
    if (!coupon) {
      return ErrorHandler("Coupon is not valid.", 404, req, res);
    }

    const applicableMeals = selectedMeals.filter(mealId =>
      coupon.meal && coupon.meal.toString() === mealId
    );

    if (applicableMeals.length === 0) {
      return ErrorHandler({ success: false, message: 'Coupon is not applicable to any selected meals.' },404, req, res);
    }
     // Calculate the total discount for applicable meals
     const totalDiscount = applicableMeals.reduce((acc, meal) => {
      return acc + (meal.price * (coupon.discount / 100));
    }, 0);


    // Calculate the new total amount after applying the discount
    const newTotalAmount = orderTotal - totalDiscount;



    return SuccessHandler(
      { success: true, message: "Coupon Applied successfully", newTotalAmount  },
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
  getMealsByCookId,
  orderTheMeal,
  getOrderedMeal,
  addReviews,
  getReviews,
  deleteReview,
  createCoupon,
  verifyCouponsAndGiveDiscount
};
