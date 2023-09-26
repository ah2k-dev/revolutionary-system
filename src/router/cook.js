const router = require("express").Router();
const cook = require("../controllers/cookController");
const isAuthenticated = require("../middleware/auth");
const { authorizedCook } = require("../middleware/role");

//✅ ➡Cook
// get
router.route("/coupons").get(isAuthenticated, authorizedCook, cook.getCoupons);
router.route("/meals").get(isAuthenticated, authorizedCook, cook.getMeals);
router.route("/orders").get(isAuthenticated, authorizedCook, cook.getOrders);
router
  .route("/ordersCount")
  .get(isAuthenticated, authorizedCook, cook.getOrdersCount);
router
  .route("/earnings")
  .get(isAuthenticated, authorizedCook, cook.cookEarnings);
//post
router
  .route("/pickupDate/:orderId")
  .post(isAuthenticated, authorizedCook, cook.providePickupDate);
router
  .route("/orderCompletion/:orderId")
  .put(isAuthenticated, authorizedCook, cook.markTheOrderAsCompleted);

module.exports = router;
