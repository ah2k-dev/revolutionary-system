const router = require("express").Router();
const cook = require("../controllers/cookController");
const isAuthenticated = require("../middleware/auth");
const { authorizedCook } = require("../middleware/role");

//✅ ➡Host
//post
router.route("/coupons").get(isAuthenticated, authorizedCook, cook.getCoupons);
router.route("/meals").get(isAuthenticated, authorizedCook, cook.getMeals);
router
  .route("/pickupDate/:orderId")
  .post(isAuthenticated, authorizedCook, cook.providePickupDate);

module.exports = router;
