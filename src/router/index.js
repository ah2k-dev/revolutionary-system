// const router = require("express").Router();
const router = require("express").Router();
const auth = require("./auth");
const user = require("./user");
const host = require('./host')

router.use("/auth", auth);
router.use("/user", user);
router.use("/host", host);

module.exports = router;
