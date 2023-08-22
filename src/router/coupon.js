const express = require("express");
const router = express.Router();
const coupon = require("../controllers/couponController");
const isAuthenticated = require("../middleware/auth");
const { authorizedCook, authorizedHost } = require("../middleware/role");

router.route("/createCoupon").post(isAuthenticated, coupon.createCoupon);
router.route("/verifyCoupon").post(isAuthenticated, coupon.verifyCoupon);
module.exports = router;
