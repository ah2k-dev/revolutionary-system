import { Router } from "express";
const router: Router = Router();
import isAuthenticated from "../middleware/auth";
import { authorizedDropshipper } from "../middleware/role";
import * as importProduct from "../controllers/importProductController";
//get
router
  .route("/add/:productId")
  .post(isAuthenticated, importProduct.importTheProduct);
export default router;
