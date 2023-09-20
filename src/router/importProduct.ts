import { Router } from "express";
const router: Router = Router();
import isAuthenticated from "../middleware/auth";
import { authorizedDropshipper } from "../middleware/role";
import * as importProduct from "../controllers/importProductController";
//post
router
  .route("/add/:productId")
  .post(isAuthenticated, authorizedDropshipper, importProduct.importTheProduct);
//put
router
  .route("/update/:importProductId")
  .put(
    isAuthenticated,
    authorizedDropshipper,
    importProduct.updateTheImportProduct
  );
//get
router
  .route("/all")
  .get(isAuthenticated, authorizedDropshipper, importProduct.getImportProducts);
//delete
router
  .route("/remove/:importProductId")
  .delete(
    isAuthenticated,
    authorizedDropshipper,
    importProduct.removeTheImportProduct
  );
export default router;
