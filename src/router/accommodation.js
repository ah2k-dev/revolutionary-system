const router = require("express").Router();
const accommodation = require("../controllers/accomodationController");
const isAuthenticated = require("../middleware/auth");
const {
  authorizedCook,
  authorizedUser,
  authorizedHost,
} = require("../middleware/role");

//✅ ➡Accommodation
//post
router
  .route("/new")
  .post(isAuthenticated, authorizedHost, accommodation.createAccomodations);
module.exports = router;
