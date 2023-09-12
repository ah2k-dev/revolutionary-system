const router = require("express").Router();
const meal = require("../controllers/mealController");
const isAuthenticated = require("../middleware/auth");
const { authorizedCook, authorizedUser } = require("../middleware/role");

//✅ ➡Meals
//post
router.route("/new").post(isAuthenticated, meal.createMeal);
//get
router.route("/getMeals").get(isAuthenticated, meal.getMeals);
router
  .route("/updateMeal/:mealId")
  .put(isAuthenticated, authorizedCook, meal.updateMeal);
// cook meals
router.route("/mealsByCookId/:id").get(isAuthenticated, meal.getMealsByCookId);
router
  .route("/delMeal")
  .delete(isAuthenticated, authorizedCook, meal.deleteMeals);
// ✅Reviews
router
  .route("/review/:id")
  .post(isAuthenticated, authorizedUser, meal.addReviews);
//get
router.route("/reviews/:cookId").get(isAuthenticated, meal.getReviews);

// ✅ ➡order the Meal
router.route("/order").post(isAuthenticated, authorizedUser, meal.orderTheMeal);
//get user ordered meals
router
  .route("/userOrderedMeals")
  .get(isAuthenticated, authorizedUser, meal.getOrderedMeal);

module.exports = router;
