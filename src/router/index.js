const router = require("express").Router();
const auth = require("./auth");
const user = require("./user");
const accomodation = require('./accomodation')

router.use("/auth", auth);
router.use("/user", user);
router.use("/accomodation", accomodation);

module.exports = router;
