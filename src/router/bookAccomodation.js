const router = require("express").Router();
const bookAccomm = require("../controllers/bookingAccomodationController");
const isAuthenticated = require("../middleware/auth");
const { authorizedUser } = require("../middleware/role");

//post
router
  .route("/new/:id")
  .post(isAuthenticated, authorizedUser, bookAccomm.bookNewAccomm);
router
  .route("/cancel/:id")
  .post(isAuthenticated, authorizedUser, bookAccomm.cancelBooking);

//get
router
  .route("/userBookings")
  .get(isAuthenticated, authorizedUser, bookAccomm.getUserBookings);

// Add reviews
//post
router
  .route("/review/:id")
  .post(isAuthenticated, authorizedUser, bookAccomm.addReviews);
module.exports = router;
