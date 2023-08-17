const router = require("express").Router();
const auth = require("./auth");
const user = require("./user");
const accomodation = require('./accomodation')
const review = require('./review')
const bookAccomm = require('./bookAccomodation')

router.use("/auth", auth);
router.use("/user", user);
router.use("/accomodation", accomodation);
router.use("/review", review);
router.use("/booking", bookAccomm);

module.exports = router;
