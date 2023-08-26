const router = require("express").Router();
const host = require("../controllers/hostAccommodation");
const isAuthenticated = require("../middleware/auth");
const { authorizedHost } = require("../middleware/role");

//✅ Host Accommodation
//get
router
  .route("/accommodations")
  .get(isAuthenticated, authorizedHost, host.hostAccomodations);

module.exports = router;
