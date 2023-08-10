const router = require("express").Router();
const user = require("../controllers/userController.js");
const isAuthenticated = require("../middleware/auth");

//get
router.route("/").put(isAuthenticated, user.updateUser);


module.exports = router;