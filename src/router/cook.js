const router = require("express").Router();
const host = require("../controllers/hostController");
const isAuthenticated = require("../middleware/auth");
const { authorizedCook } = require("../middleware/role");

//✅ ➡Host
//post
router
  .route("/accommodation")
  .get(isAuthenticated, authorizedCook, host.getAccomodations);
module.exports = router;
