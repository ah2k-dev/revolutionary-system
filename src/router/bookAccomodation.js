const router = require("express").Router();
const bookAccomm = require("../controllers/bookingAccomodationController");
const isAuthenticated = require("../middleware/auth");

//post
router.route("/new/:id").post(isAuthenticated, bookAccomm.bookNewAccomm);
//put
//delete
//get
router.route("/userBookings").get(isAuthenticated, bookAccomm.getUserBookings);

module.exports = router;
