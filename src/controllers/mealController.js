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
    const {
      dishName,
      desc,
      price,
      gram,
      calories,
      maxServingCapacity,
      spiceStatus,
      category,
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

    let imagesFileName = [];
    const { images } = req.files;
    const imageArray = Array.isArray(images) ? images : [images];

    for (let img of imageArray) {
      // It should be image

      let imgFile = `${Date.now()}-${img.name}`;
      imagesFileName.push(imgFile);
      img.mv(path.join(__dirname, `../../uploads/${imgFile}`), (err) => {
        if (err) {
          return ErrorHandler(err.message, 400, req, res);
        }
      });
    }

    const newMeal = await Meal.create({
      cook: cookId,
      dishName,
      desc,
      price,
      gram,
      calories,
      maxServingCapacity,
      spiceStatus,
      images: imagesFileName,
      category,
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
  const { mealId } = req.params;

  try {
    const {
      dishName,
      desc,
      price,
      gram,
      calories,
      spiceStatus,
      maxServingCapacity,
      category,
    } = req.body;
    const meal = await Meal.findOne({
      _id: mealId,
      cook: cookId,
    });

    if (!meal) {
      return ErrorHandler("Meal not found or unauthorized", 404, req, res);
    }

    let imagesFileName = [];
    meal.images.forEach((img) => imagesFileName.push(img));
    if (req.files && req.files.images) {
      // console.log("Upload block");
      imagesFileName = [];
      const { images } = req.files;

      // `images` is an array, if there's only one image uploaded
      const imageArray = Array.isArray(images) ? images : [images];
      for (const img of imageArray) {
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
      mealId,
      {
        dishName,
        desc,
        price,
        gram,
        calories,
        spiceStatus,
        maxServingCapacity,
        images: imagesFileName,
        category,
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
  try {
    // const { minPrice } = req.query;
    // const { maxPrice } = req.query;
    // const priceFilter = {
    //   price: { $lte: Number(maxPrice), $gte: Number(minPrice) },
    // };

    //✅ Price Filter
    const priceFilter =
      req.body.price && req.body.price.length > 0
        ? {
            price: {
              $lte: Number(req.body.price[1]),
              $gte: Number(req.body.price[0]),
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
      // cook,
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
      {
        message: "Meal Fetched successfully",
        baseUrl: `${process.env.BASE_URL}/uploads/`,
        mealsCount,
        meals,
      },
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

    return SuccessHandler({ message: "Meal Deleted successfully" }, 200, res);
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
        404,
        req,
        res
      );
    }
    const totalMeals = meals.length;
    return SuccessHandler(
      {
        message: "Fetched Cook Meals successfully",
        baseUrl: `${process.env.BASE_URL}/uploads/`,
        totalMeals,
        meals,
      },
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
      // meals: meals,
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
      select:
        "_id dishName price images spiceStatus maxServingCapacity category",
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
    // const order = await OrderMeal.findOne({
    //   _id: orderId,
    //   user: currentUser,
    //   status: "completed",
    // });
    // console.log(order.meals[0].meal);
    const order = await OrderMeal.findOne({
      _id: orderId,
      user: currentUser,
      status: "completed",
    }).populate({
      path: "meals.meal",
      model: "Meal",
      select: "cook",
    });
    const cookId = order.meals[0].meal.cook;

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
      cook: cookId,
    });
    await review.save();

    const Ratings = await Review.aggregate([
      {
        $match: { cook: cookId, rating: { $ne: 0 } },
      },
      {
        $group: { _id: "$cook", avgRating: { $avg: "$rating" } },
      },
    ]);
    const [{ _id, avgRating }] = Ratings;
    // console.log(_id);
    // console.log(avgRating);
    await User.findByIdAndUpdate(cookId, {
      $push: { reviewsId: _id },
      shopRating: avgRating.toFixed(1),
    });
    // console.log(Ratings);

    return SuccessHandler({ message: "Review added successfully" }, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getReviews = async (req, res) => {
  // #swagger.tags = ['meal']
  try {
    const { cookId } = req.params;
    console.log(cookId);
    const reviews = await User.find({ _id: cookId })
      .select("username email avatar coverImg shopName shopDesc shopBanner")
      .populate({
        path: "reviewsId",
        select: "user comment rating",
        match: { cook: cookId },
        populate: {
          path: "user",
          select: "username email avatar",
        },
      });
    if (!reviews) {
      return ErrorHandler("The Reviews or Cook doesn't exist", 400, req, res);
    }
    // const reviews = cook.reviewsId;
    return SuccessHandler(
      {
        message: "Fetched Reviews successfully",
        baseUrl: `${process.env.BASE_URL}/uploads/`,
        reviews,
      },
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
  updateMeal,
  deleteMeals,
  getMealsByCookId,
  orderTheMeal,
  getOrderedMeal,
  addReviews,
  getReviews,
};
