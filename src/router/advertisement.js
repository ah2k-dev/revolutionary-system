const express = require("express");
const router = express.Router();
const advertisement = require("../controllers/advertisementController");
const isAuthenticated = require("../middleware/auth");
const { authorizedHost } = require("../middleware/role");

router
  .route("/new/:id")
  .post(isAuthenticated, authorizedHost, advertisement.advertiseAccomodations);
router
  .route("/new/:id")
  .post(isAuthenticated, authorizedHost, advertisement.advertiseAccomodations);
module.exports = router;
