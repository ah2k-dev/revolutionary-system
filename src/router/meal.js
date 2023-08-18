const router = require("express").Router();
const meal = require("../controllers/mealController");
const isAuthenticated = require("../middleware/auth");
const { authorizedCook } = require("../middleware/role");

//post
router.route("/new").post(isAuthenticated, authorizedCook, meal.createMeal);
//get
router.route("/getMeals").get(isAuthenticated, meal.getMeals);


module.exports = router;
