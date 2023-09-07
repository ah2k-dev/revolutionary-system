const router = require("express").Router();
const dinner = require("../controllers/dinnerController");
const isAuthenticated = require("../middleware/auth");
const {
  authorizedCook,
  authorizedUser,
  authorizedHost,
} = require("../middleware/role");

//✅ ➡Dinner
//post
router.route("/new").post(isAuthenticated, authorizedHost, dinner.createDinner);
module.exports = router;
