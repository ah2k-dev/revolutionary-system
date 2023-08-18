const router = require("express").Router();
const cart = require("../controllers/cartController");
const isAuthenticated = require("../middleware/auth");

//post
router.route("/add/:id").post(isAuthenticated, cart.addMealInCart);
//put
//delete


module.exports = router;
