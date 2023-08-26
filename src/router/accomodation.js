const router = require("express").Router();
const accomodation = require("../controllers/accomodationController");
const isAuthenticated = require("../middleware/auth");
const { authorizedHost, authorizedUser } = require("../middleware/role");

//✅Accomodations

//post
router
  .route("/newAccomodation")
  .post(isAuthenticated, authorizedHost, accomodation.createAccomodations);
router
  .route("/getAccomodations")
  .post(isAuthenticated, accomodation.getAllAccomodations);
//put
router
  .route("/updateAccomodation/:id")
  .put(isAuthenticated, authorizedHost, accomodation.updateAccomodations);
//delete
router
  .route("/deleteAccomodation/:id")
  .delete(isAuthenticated, authorizedHost, accomodation.deleteAccomodations);

// ✅Reviews

//post
router
  .route("/addReview/:id")
  .post(isAuthenticated, authorizedUser, accomodation.addReview);
//get
router
  .route("/reviews/:id")
  .get(isAuthenticated, authorizedUser, accomodation.getReviews);
// delete
router
  .route("/delReview/:id")
  .delete(isAuthenticated, authorizedUser, accomodation.deleteReview);

module.exports = router;
