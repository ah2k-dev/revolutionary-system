const router = require("express").Router();
const host = require("../controllers/hostController");
const isAuthenticated = require("../middleware/auth");
const {
  authorizedCook,
  authorizedUser,
  authorizedHost,
} = require("../middleware/role");

//✅ ➡Host
//post
router
  .route("/accommodation")
  .get(isAuthenticated, authorizedHost, host.getAccomodations);
router
  .route("/bookings")
  .post(isAuthenticated, authorizedHost, host.getBookings);
router
  .route("/bookingsCount")
  .get(isAuthenticated, authorizedHost, host.getBookingsCount);
router
  .route("/earnings")
  .get(isAuthenticated, authorizedHost, host.hostEarnings);
module.exports = router;
