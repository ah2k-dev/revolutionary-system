
import * as express from "express";
const router = express.Router();
import isAuthenticated from "../middleware/auth";
import {register, login, requestEmailToken, verifyEmail, forgotPassword,resetPassword, updatePassword, logout} from '../controllers/authController'

//get
router.route("/logout").get(logout);
//post
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/requestEmailToken").post(requestEmailToken);
router.route("/verifyEmail").post(verifyEmail);
router.route("/forgotPassword").post(forgotPassword);
//put
router.route("/resetPassword").put(resetPassword);
router.route("/updatePassword").put(isAuthenticated, updatePassword);

export default router;
