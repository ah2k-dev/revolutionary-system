const router = require("express").Router();
const auth = require("./auth");
const user = require("./user");
const accomodation = require("./accomodation");
const bookAccomm = require("./bookAccomodation");
const meal = require("./meal");
const coupon = require("./coupon");

router.use("/auth", auth);
router.use("/user", user);
router.use("/accomodation", accomodation);
router.use("/booking", bookAccomm);
router.use("/meal", meal);
router.use("/coupon", coupon);

module.exports = router;
