const router = require("express").Router();
const review = require("../controllers/reviewController");
const isAuthenticated = require("../middleware/auth");

//post
router.route("/:id/newReview").post(isAuthenticated, review.addReviews);
//put
//delete
//get
router.route("/:id/getReviews").get(isAuthenticated, review.gettingReviews);


module.exports = router;
