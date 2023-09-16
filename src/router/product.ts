import { Router } from "express";
const router: Router = Router();
import isAuthenticated from "../middleware/auth";
import { authorizedSupplier } from "../middleware/role";
import * as product from '../controllers/productController'
//get
router.route("/create").post(isAuthenticated,authorizedSupplier,product.createProduct);

export default router;
