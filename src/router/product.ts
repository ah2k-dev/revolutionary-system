import { Router } from "express";
const router: Router = Router();
import isAuthenticated from "../middleware/auth";
import { authorizedSupplier } from "../middleware/role";
import * as product from '../controllers/productController'
import { multipleUpload, singleUpload } from "../middleware/multer";
//get
router.route("/create").post(isAuthenticated,authorizedSupplier,singleUpload('images'),product.createProduct);
router.route("/get").post(isAuthenticated,authorizedSupplier,product.getProducts);

export default router;
