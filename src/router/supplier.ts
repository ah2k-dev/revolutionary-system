import { Router } from "express";
const router: Router = Router();
import isAuthenticated from "../middleware/auth";
import { authorizedSupplier } from "../middleware/role";
import * as supplier from '../controllers/supplierController'
//get
router.route("/createProfile").post(isAuthenticated,authorizedSupplier,supplier.createProfile);
router.route("/updateProfile").put(isAuthenticated,authorizedSupplier,supplier.updateProfile);

export default router;
