const auth = require("./auth");
const router = require("express").Router();
// import auth from './auth'

router.use("/auth", auth);

export default router;
