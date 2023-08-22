const router = require("express").Router();
const user = require("../controllers/userController.js");
const isAuthenticated = require("../middleware/auth");
const { authorizedCook, authorizedHost } = require("../middleware/role.js");

//put
router
  .route("/update-personal-info")
  .put(isAuthenticated, user.updatePersonalInfo);
router.route("/update-info").put(isAuthenticated, user.updateUser);
// Saved and Unsaved Accomodation
router
  .route("/savedOrUnsavedAccomodation/:id")
  .put(isAuthenticated, user.savedOrUnsavedAccomodation);
// Saved and Unsaved Meal
router.route('/savedOrUnsavedMeal/:id').put(isAuthenticated, user.savedOrUnsavedMeal)




//get
router.route("/userProfile").get(isAuthenticated, user.getUserProfile);
// Saved Accomodation
router
  .route("/savedAccomodations")
  .get(isAuthenticated, user.getSavedAccomodations);
router.route("/getCook").get(isAuthenticated, user.getCooks);
// Saved Meal
router.route('/savedMeals').get(isAuthenticated, user.getSavedMeals)

// ✅ Coupon for the Cooks
// get
router.route("/cookCoupons").get(isAuthenticated, authorizedCook, user.getCouponsForCook);


module.exports = router;
