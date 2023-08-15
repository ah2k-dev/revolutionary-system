const router = require("express").Router();
const auth = require("./auth");
const user = require("./user");
const accomodation = require('./accomodation')
const review = require('./review')

router.use("/auth", auth);
router.use("/user", user);
router.use("/accomodation", accomodation);
router.use("/review", review);

module.exports = router;
