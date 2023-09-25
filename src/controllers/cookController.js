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

const getOrders = async (req, res) => {
  // #swagger.tags = ['cook']
  try {
    let statusFilter = {};
    if (req.query.status === "active") {
      statusFilter = { status: { $in: ["approved", "pending"] } };
    } else if (req.query.status === "completed") {
      statusFilter = { status: "completed" };
    }
    const meals = await Meal.find({ cook: req.user._id }).distinct("_id");
    const orders = await OrderMeal.find({
      "meals.meal": { $in: meals },
      ...statusFilter,
    });
    return SuccessHandler(
      {
        message: `Orders fetched successfully`,
        baseUrl: `${process.env.BASE_URL}/uploads/`,
        orders,
      },
      200,
      res
    );
  } catch (error) {
    ErrorHandler(error.message, 500, req, res);
  }
};
const getOrdersCount = async (req, res) => {
  // #swagger.tags = ['cook']
  try {
    // const bookingCount = await Booking.aggregate([
    //   {
    //     $lookup: {
    //       from: "accommodations",
    //       localField: "accommodation",
    //       foreignField: "_id",
    //       as: "accommodationDetail",
    //     },
    //   },
    //   {
    //     $match: {
    //       "accommodationDetail.host": host,
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: null,
    //       activeCount: {
    //         $sum: {
    //           $cond: [{ $eq: ["$status", "active"] }, 1, 0],
    //         },
    //       },
    //       completedCount: {
    //         $sum: {
    //           $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
    //         },
    //       },
    //       cancelledCount: {
    //         $sum: {
    //           $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0],
    //         },
    //       },
    //       previousCount: {
    //         $sum: {
    //           $cond: [{ $eq: ["$status", "previous"] }, 1, 0],
    //         },
    //       },
    //     },
    //   },
    // ]);
    const meals = await Meal.find({ cook: req.user._id }).distinct("_id");
    const orders = await OrderMeal.find({
      "meals.meal": { $in: meals },
    });
    const ordersCount = await OrderMeal.aggregate([
      {
        $match: {
          _id: { $in: orders.map((order) => order._id) },
          // _id: { $in: orders },
        },
      },
      {
        $group: {
          _id: null,
          pendingOrders: {
            $sum: {
              $cond: [{ $eq: ["$status", "pending"] }, 1, 0],
            },
          },
          completedOrders: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
            },
          },
          approvedOrders: {
            $sum: {
              $cond: [{ $eq: ["$status", "approved"] }, 1, 0],
            },
          },
        },
      },
    ]);
    return SuccessHandler(
      {
        message: `Orders Count successfully`,
        ordersCount,
      },
      200,
      res
    );
  } catch (error) {
    ErrorHandler(error.message, 500, req, res);
  }
};

const cookEarnings = async (req, res) => {
  // #swagger.tags = ['cook']
  try {
    const cook = req.user._id;

    const earning = await Booking.aggregate([
      {
        $match: {
          status: "completed",
        },
      },
      {
        $lookup: {
          from: "accommodations",
          localField: "accommodation",
          foreignField: "_id",
          as: "accommodationDetail",
        },
      },
      {
        $match: {
          "accommodationDetail.host": host,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: "$subTotal" },
        },
      },
      {
        $project: {
          monthName: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id.month", 1] }, then: "January" },
                { case: { $eq: ["$_id.month", 2] }, then: "February" },
                { case: { $eq: ["$_id.month", 3] }, then: "March" },
                { case: { $eq: ["$_id.month", 4] }, then: "April" },
                { case: { $eq: ["$_id.month", 5] }, then: "May" },
                { case: { $eq: ["$_id.month", 6] }, then: "June" },
                { case: { $eq: ["$_id.month", 7] }, then: "July" },
                { case: { $eq: ["$_id.month", 8] }, then: "August" },
                { case: { $eq: ["$_id.month", 9] }, then: "September" },
                { case: { $eq: ["$_id.month", 10] }, then: "October" },
                { case: { $eq: ["$_id.month", 11] }, then: "November" },
                { case: { $eq: ["$_id.month", 12] }, then: "December" },
              ],
              default: "Unknown month",
            },
          },
          total: 1,
        },
      },
      {
        $project: {
          monthTotal: {
            $concat: [
              "subTotal in ",
              "$monthName",
              ": ",
              { $toString: "$total" },
            ],
          },
        },
      },

      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // array of all months from 1 to 12
    const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);
    // console.log(allMonths);
    const earningMap = new Map(
      earning.map((entry) => [entry._id.month, entry])
    );
    // Iterate through all months and add entries with zero earnings if missing
    const result = allMonths.map((month) => {
      const existingEntry = earningMap.get(month);
      // console.log("existingEntry: ", existingEntry);
      if (existingEntry) {
        return existingEntry;
      } else {
        return {
          _id: {
            year: new Date().getFullYear(),
            month: month,
          },
          monthTotal: `subTotal in ${monthNames[month - 1]}: 0`,
        };
      }
    });
    // console.log(result);

    // Sort the result by year and month
    result.sort((a, b) => {
      if (a._id.year === b._id.year) {
        return a._id.month - b._id.month;
      }
      return a._id.year - b._id.year;
    });

    // Now 'result' contains all months of the year with earnings, including zero earnings.

    // console.log(result);

    return SuccessHandler(
      {
        message: "Earning Fetched successfully",
        result,
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
  getOrders,
  getOrdersCount,
};
