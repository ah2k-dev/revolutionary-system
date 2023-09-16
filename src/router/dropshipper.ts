import { Router } from "express";
const router: Router = Router();
import isAuthenticated from "../middleware/auth";
import { authorizedDropshipper } from "../middleware/role";
import * as dropshipper from '../controllers/dropshipperController'
//get
router.route("/createProfile").post(isAuthenticated,authorizedDropshipper,dropshipper.createProfile);
router.route("/updateProfile").put(isAuthenticated,authorizedDropshipper,dropshipper.updateProfile);

export default router;
