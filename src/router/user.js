const router = require("express").Router();
const user = require("../controllers/userController");
const isAuthenticated = require("../middleware/auth");
const { authorizedCook, authorizedUser } = require("../middleware/role.js");

//put
router
  .route("/update-personal-info")
  .put(isAuthenticated, user.updatePersonalInfo);
router.route("/update-info").put(isAuthenticated, user.updateUser);
// Saved and Unsaved Accomodation
router
  .route("/savedOrUnsavedAccomodation/:id")
  .put(isAuthenticated, authorizedUser, user.savedOrUnsavedAccomodation);
// Saved and Unsaved Meal
router
  .route("/savedOrUnsavedMeal/:id")
  .put(isAuthenticated, authorizedUser, user.savedOrUnsavedMeal);

//get
router.route("/userProfile").get(isAuthenticated, user.getUserProfile);
// Saved Accomodation
router
  .route("/savedAccomodations")
  .get(isAuthenticated, authorizedUser, user.getSavedAccomodations);
router.route("/getCook").get(isAuthenticated, user.getCooks);
// Saved Meal
router
  .route("/savedMeals")
  .get(isAuthenticated, authorizedUser, user.getSavedMeals);

// ✅ Coupon for the Cooks

// ✅ Saved Cook
router
  .route("/savedOrUnsavedCook/:id")
  .put(isAuthenticated, user.savedOrUnsavedCook);
router.route("/savedCook").get(isAuthenticated, user.getSavedCook);
router.route("/bookings").get(isAuthenticated, user.getUserBookings);

module.exports = router;
