import { Router } from "express";
const router: Router = Router();
import isAuthenticated from "../middleware/auth";
import { authorizedSupplier } from "../middleware/role";
import * as product from "../controllers/productController";
//get
router
  .route("/create")
  .post(isAuthenticated, authorizedSupplier, product.createProduct);
router
  .route("/get")
  .post(isAuthenticated, authorizedSupplier, product.getProducts);
router
  .route("/update/:productId")
  .put(isAuthenticated, authorizedSupplier, product.updateProduct);
router
  .route("/delete/:productId")
  .delete(isAuthenticated, authorizedSupplier, product.deleteProduct);
router.route("/details/:slug").get(isAuthenticated, product.productDetails);

export default router;
