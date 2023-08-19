const router = require("express").Router();
const review = require("../controllers/reviewController");
const isAuthenticated = require("../middleware/auth");

//post
router.route("/newReview/:id").post(isAuthenticated, review.addReviews);
//put
//delete
//get
router.route("/getReviews/:id").get(isAuthenticated, review.gettingReviews);

module.exports = router;
