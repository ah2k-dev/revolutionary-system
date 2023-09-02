const router = require("express").Router();
const host = require("../controllers/hostController");
const isAuthenticated = require("../middleware/auth");
const { authorizedHost } = require("../middleware/role");

//✅ Host Accommodation
//get
router
  .route("/accommodations")
  .get(isAuthenticated, authorizedHost, host.hostAccomodations);
router
  .route("/bookings")
  .get(isAuthenticated, authorizedHost, host.hostBookings);
router
  .route("/booking/count")
  .get(isAuthenticated, authorizedHost, host.bookingCount);

module.exports = router;
