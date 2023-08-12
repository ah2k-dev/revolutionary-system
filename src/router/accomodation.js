const router = require("express").Router();
const accomodation = require("../controllers/accomodationController");
const isAuthenticated = require("../middleware/auth");
const { authorizedHost } = require("../middleware/role");

//post
router.route("/newAccomodation").post(isAuthenticated, authorizedHost, accomodation.createAccomodations);
router.route("/getAccomodations").post(isAuthenticated, authorizedHost, accomodation.getAllAccomodations);
//put
router.route("/updateAccomodation/:id").put(isAuthenticated, authorizedHost, accomodation.updateAccomodations);
//delete
router.route("/deleteAccomodation/:id").delete(isAuthenticated, authorizedHost, accomodation.deleteAccomodations);
//get


module.exports = router;
