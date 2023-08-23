const express = require("express");
const router = express.Router();
const oneSignal = require("../controllers/OneSignal");
const isAuthenticated = require("../middleware/auth");
const {
  authorizedCook,
  authorizedHost,
  authorizedUser,
} = require("../middleware/role");

    router.route("/send").post(isAuthenticated, oneSignal.sendNotification);
module.exports = router;
