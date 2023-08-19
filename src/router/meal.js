const router = require("express").Router();
const meal = require("../controllers/mealController");
const isAuthenticated = require("../middleware/auth");
const { authorizedCook } = require("../middleware/role");

//post
router.route("/new").post(isAuthenticated, authorizedCook, meal.createMeal);
//get
router.route("/getMeals").get(isAuthenticated, meal.getMeals);
router.route("/mealsByCookId/:id").get(isAuthenticated, meal.getMealsByCookId);


// order the Meal
//post
router.route("/orderMeal").post(isAuthenticated, meal.orderTheMeal);



module.exports = router;
