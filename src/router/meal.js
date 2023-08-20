const router = require("express").Router();
const meal = require("../controllers/mealController");
const isAuthenticated = require("../middleware/auth");
const { authorizedCook } = require("../middleware/role");

//✅ ➡Meals
//post
router.route("/new").post(isAuthenticated, authorizedCook, meal.createMeal);
//get
router.route("/getMeals").get(isAuthenticated, meal.getMeals);
router.route("/mealsByCookId/:id").get(isAuthenticated, meal.getMealsByCookId);

// ✅Reviews

//post
router.route("/addReview/:id").post(isAuthenticated, meal.addReviews);
//get
router.route("/reviews/:id").get(isAuthenticated, meal.getReviews);
// delete
router.route("/delReview/:id").delete(isAuthenticated, meal.deleteReview);

// ✅ ➡order the Meal
//post
router.route("/orderMeal").post(isAuthenticated, meal.orderTheMeal);
//get user ordered meals
router.route("/userOrderedMeals").get(isAuthenticated, meal.getOrderedMeal);

module.exports = router;
