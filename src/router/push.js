const express = require("express");
const router = express.Router();
const push = require("../controllers/pushNotifController");
const isAuthenticated = require("../middleware/auth");
const {
  authorizedCook,
  authorizedHost,
  authorizedUser,
} = require("../middleware/role");

router.route("/send").post(isAuthenticated, push.sendNotification);
router
  .route("/view/:notificationId")
  .get(isAuthenticated, push.getNotification);
module.exports = router;
