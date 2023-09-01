const Meal = require("../models/Meal/meal");
const User = require("../models/User/user");
const OrderMeal = require("../models/Meal/orderMeal");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const path = require("path");
const Review = require("../models/Reviews/review");
const Coupon = require("../models/Coupon/coupon");

//Create Meal
const createMeal = async (req, res) => {
  // #swagger.tags = ['meal']
  try {
    const { dishName, desc, price, gram, calories, maxServingCapacity } =
      req.body;
    let mealAddedBy = "";
    if (req.user.role === "host") {
      mealAddedBy = "host";
    } else {
      mealAddedBy = "cook";
    }

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

    let imagesFileName = [];
    const { images } = req.files;
    if (images) {
      for (let img of images) {
        // It should be image
        if (!img.mimetype.startsWith("image")) {
          return ErrorHandler("Please upload an image file", 400, req, res);
        }

        let imgFileName = `${Date.now()}-${img.name}`;
        imagesFileName.push(imgFileName);
        img.mv(path.join(__dirname, `../../uploads/${imgFileName}`), (err) => {
          if (err) {
            return ErrorHandler(err.message, 400, req, res);
          }
        });
      }
    }

    const newMeal = await Meal.create({
      cook: cookId,
      dishName,
      desc,
      price,
      gram,
      calories,
      maxServingCapacity,
      mealType: mealAddedBy,
      images: imagesFileName,
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

//Update Meal
const updateMeal = async (req, res) => {
  // #swagger.tags = ['meal']
  const cookId = req.user._id;
  try {
    const { dishName, desc, price, gram, calories, maxServingCapacity } =
      req.body;
    let mealAddedBy = "";
    if (req.user.role === "host") {
      mealAddedBy = "host";
    } else {
      mealAddedBy = "cook";
    }

    let imagesFileName = [];
    const { images } = req.files;
    if (images) {
      for (const img of images) {
        if (!img.mimetype.startsWith("image")) {
          return ErrorHandler("Please upload an image", 500, req, res);
        }
        let imgFile = `${Date.now()}-${img.name}`;
        imagesFileName.push(imgFile);
        img.mv(path.join(__dirname, `../../uploads/${imgFile}`), (err) => {
          if (err) {
            return ErrorHandler(err.message, 400, req, res);
          }
        });
      }
    }

    const updatedMeal = await Meal.findByIdAndUpdate(
      req.params.id,
      {
        dishName,
        desc,
        price,
        gram,
        calories,
        maxServingCapacity,
        mealType: mealAddedBy,
        images: imagesFileName,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedMeal) {
      return ErrorHandler("Accommodation does not exist", 400, req, res);
    }

    return SuccessHandler(
      { success: true, message: "Updated Meal successfully", updatedMeal },
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
  const { cook } = req.body;
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
      cook,
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

const deleteMeals = async (req, res) => {
  // #swagger.tags = ['meal']
  try {
    const deleteMeal = await Meal.findByIdAndUpdate(req.params.id, {
      $set: {
        isActive: false,
      },
    });

    if (!deleteMeal) {
      return ErrorHandler("Meal does not exist", 400, req, res);
    }

    return SuccessHandler(
      { success: true, message: "Meal Deleted successfully" },
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
    const { meals, subTotal, couponCode, tip, couponId } = req.body;
    // console.log(currentUser);

    // : JSON.parse(meals)
    const order = await OrderMeal.create({
      user: currentUser,
      coupon: couponId,
      meals: JSON.parse(meals),
      subTotal: subTotal,
      usedCoupon: couponCode,
      tip: tip,
    });

    await order.save();

    if (couponCode) {
      await Coupon.findOneAndUpdate(
        {
          couponCode: couponCode,
        },
        {
          $push: { user: currentUser },
        }
      );
    }

    return SuccessHandler(
      { message: "Meal's Order Created successfully", order },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

// Get Ordered the meal
const getOrderedMeal = async (req, res) => {
  // #swagger.tags = ['meal']
  const currentUser = req.user._id;
  try {
    // const userMeals = await OrderMeal.find({ user: currentUser }).populate(
    //   "meals.meal",
    //   "dishName spiceStatus price cook images"
    // );
    const userMeals = await OrderMeal.find({ user: currentUser }).populate({
      path: "meals.meal",
      select: "_id dishName price images spiceStatus maxServingCapacity",
      populate: {
        path: "cook",
        model: "User",
        select: "shopName shopBanner username email",
      },
    });
    // console.log(userMeals.meals);

    // const cookID = userMeals.map((orders)=>{
    //   orders.meals.map((meal)=>{
    //     const {cook} = meal.meal
    //     return cook
    //   })
    // })
    // console.log(cookID);

    // const cookID = userMeals.map(orderMeal => {
    //   orderMeal.meals.map(meal => {
    //     const { cook } = meal.meal;
    //     // cookDetailsArray.push(cook);
    //     return cook
    //   });
    // });

    // console.log(cookID);

    // const userMeals = await OrderMeal.find({ user: currentUser }).populate({
    //   path: "meals.meal",
    //   populate: {
    //     path: "cook",
    //     model: "User",
    //     select: "name email shopName shopBanner",
    //   },
    // });

    return SuccessHandler(
      { message: "Fetched user ordered meals successfully", userMeals },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

// add reviews on Meal Order
const addReviews = async (req, res) => {
  // #swagger.tags = ['meal']
  const currentUser = req.user._id;
  const orderId = req.params.id;

  try {
    const { rating, comment } = req.body;
    const order = await OrderMeal.findOne({
      _id: orderId,
      user: currentUser,
      status: "approved",
    });
    if (!order) {
      return ErrorHandler(
        "No Such Order exist or you're not the user who made the Order.",
        400,
        req,
        res
      );
    }
    const review = await Review.create({
      rating: Number(rating),
      comment,
      user: currentUser,
      order: orderId,
    });
    await review.save();

    const cookReview = await Review.find({
      accomodation: accommodationId,
    });
    console.log(accomodationReview);
    let allRating = accomodationReview.map((accRating) => accRating.rating);
    // // console.log(allRating);
    let totalRating = allRating.reduce(
      (acc, currentRating) => acc + currentRating,
      0
    );
    const avgRating = totalRating / accomodationReview.length;

    await Accomodation.findByIdAndUpdate(accommodationId, {
      $push: { reviewsId: review._id },
      rating: avgRating.toFixed(1),
    });

    // const avgRating = totalRating / accomodationReview.length;

    // await Accomodation.findByIdAndUpdate(accommodationId, {
    //   $push: { reviewsId: review._id },
    //   rating: avgRating.toFixed(1),
    // });

    // const mealReviews = await Review.find({
    //   meal: mealId,
    // });
    // let allRating = mealReviews.map((accRating) => accRating.rating);
    // let totalRating = allRating.reduce(
    //   (acc, currentRating) => acc + currentRating,
    //   0
    // );
    // const avgRating = totalRating / mealReviews.length;

    // await Meal.findByIdAndUpdate(mealId, {
    //   $push: { reviewsId: review._id },
    //   rating: avgRating,
    // });

    // const gettingCookId = await Meal.findOne({ _id: mealId });
    // const cookId = gettingCookId.cook;
    // console.log(cookId);

    const avgRatings = await Meal.aggregate([
      {
        $match: { cook: cookId, rating: { $ne: 0 } },
      },
      {
        $group: { _id: "$cook", avgRatingg: { $avg: "$rating" } },
      },
    ]);
    const [{ _id, avgRatingg }] = avgRatings;
    console.log(_id);
    console.log(avgRatingg);
    await User.findByIdAndUpdate(_id, {
      shopRating: avgRatingg,
    });

    return SuccessHandler({ message: "Review added successfully" }, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

// const getReviews = async (req, res) => {
//   // #swagger.tags = ['meal']
//   try {
//     const mealId = req.params.id;
//     const meal = await Meal.findById(mealId).populate("reviewsId");
//     if (!meal) {
//       return ErrorHandler("The Meal doesn't exist", 400, req, res);
//     }
//     const reviews = meal.reviewsId;
//     return SuccessHandler(
//       {
//         success: true,
//         message: "Fetched Reviews successfully",
//         reviews,
//       },
//       200,
//       res
//     );
//   } catch (error) {
//     return ErrorHandler(error.message, 500, req, res);
//   }
// };
// const deleteReview = async (req, res) => {
//   // #swagger.tags = ['meal']
//   try {
//     const { reviewId } = req.query;
//     const mealId = req.params.id;

//     const review = await Review.findByIdAndDelete({
//       _id: reviewId,
//     });
//     if (!review) {
//       return ErrorHandler(
//         { success: false, message: "Review not found or unauthorized" },
//         404,
//         req,
//         res
//       );
//     }
//     await Meal.findByIdAndUpdate(mealId, {
//       $pull: { reviewsId: reviewId },
//     });
//     return SuccessHandler(
//       { success: true, message: "Review has been Deleted" },
//       200,
//       res
//     );
//   } catch (error) {
//     return ErrorHandler(error.message, 500, req, res);
//   }
// };

module.exports = {
  createMeal,
  getMeals,
  updateMeal,
  deleteMeals,
  getMealsByCookId,
  orderTheMeal,
  getOrderedMeal,
  addReviews,
};
