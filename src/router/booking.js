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
router.route("/new/:id").post(isAuthenticated, booking.createBooking);
router
  .route("/cancel/:bookingId")
  .post(isAuthenticated, booking.cancelTheBooking);
module.exports = router;
