const router = require("express").Router();
const host = require("../controllers/hostController");
const isAuthenticated = require("../middleware/auth");
const { authorizedCook, authorizedHost } = require("../middleware/role.js");

//post
router
  .route("/newAccomodation")
  .post(isAuthenticated, authorizedHost, host.createAccomodations);

//get
// router.route("/getusers").get(isAuthenticated, authorizedHost, user.getAllUsers);

module.exports = router;
