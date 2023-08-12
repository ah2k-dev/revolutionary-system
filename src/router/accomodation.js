const router = require("express").Router();
const accomodation = require("../controllers/accomodationController");
const isAuthenticated = require("../middleware/auth");
const { authorizedCook, authorizedHost } = require("../middleware/role");

//post
router.route("/newAccomodation").post(isAuthenticated, authorizedHost, accomodation.createAccomodations);
//put
router.route("/updateAccomodation/:id").put(isAuthenticated, authorizedHost, accomodation.updateAccomodations);
//delete
router.route("/deleteAccomodation/:id").delete(isAuthenticated, authorizedHost, accomodation.deleteAccomodations);
//get
router.route("/getAccomodations").get(isAuthenticated, authorizedHost, accomodation.getAllAccomodations);


module.exports = router;
