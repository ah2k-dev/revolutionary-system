const express = require("express");
const router = express.Router();
const coupon = require("../controllers/couponController");
const isAuthenticated = require("../middleware/auth");
const {
  authorizedCook,
  authorizedHost,
  authorizedUser,
} = require("../middleware/role");

router.route("/createCoupon").post(isAuthenticated, coupon.createCoupon);
router
  .route("/verifyCoupon")
  .post(isAuthenticated, authorizedUser, coupon.verifyCoupon);
module.exports = router;