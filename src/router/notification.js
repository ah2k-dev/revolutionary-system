const express = require("express");
const router = express.Router();
const notification = require("../controllers/notificationController");
const isAuthenticated = require("../middleware/auth");
const {
  authorizedCook,
  authorizedHost,
  authorizedUser,
} = require("../middleware/role");

router.route("/send").post(notification.sendNotification);
router
  .route("/view/:notificationId")
  .get(isAuthenticated, notification.viewNotification);
module.exports = router;
