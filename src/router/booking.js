const router = require("express").Router();
const booking = require("../controllers/bookingController");
const isAuthenticated = require("../middleware/auth");
const {
  authorizedCook,
  authorizedUser,
  authorizedHost,
} = require("../middleware/role");

//✅ ➡Booking
//post
router.route("/new").post(isAuthenticated, booking.createBooking);
module.exports = router;
