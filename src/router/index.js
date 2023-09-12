const router = require("express").Router();
const auth = require("./auth");
const user = require("./user");
const accommodation = require("./accommodation");
const booking = require("./booking");
const meal = require("./meal");
const coupon = require("./coupon");
const host = require("./host");
const notification = require("./notification");
router.use("/auth", auth);
router.use("/user", user);
router.use("/accommodation", accommodation);
router.use("/booking", booking);
router.use("/meal", meal);
router.use("/coupon", coupon);
router.use("/host", host);
router.use("/notification", notification);
module.exports = router;
