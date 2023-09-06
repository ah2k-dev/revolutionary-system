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
  .route("/getAll")
  .get(isAuthenticated, authorizedHost, host.getAccomodations);
module.exports = router;
