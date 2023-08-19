const router = require("express").Router();
const auth = require("./auth");
const user = require("./user");
const accomodation = require("./accomodation");
const review = require("./review");
const bookAccomm = require("./bookAccomodation");
const meal = require("./meal");

router.use("/auth", auth);
router.use("/user", user);
router.use("/accomodation", accomodation);
router.use("/review", review);
router.use("/booking", bookAccomm);
router.use("/meal", meal);

module.exports = router;
