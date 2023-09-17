import { Router } from "express";
const router: Router = Router();
import isAuthenticated from "../middleware/auth";
import { authorizedSupplier } from "../middleware/role";
import * as supplier from "../controllers/supplierController";
import { singleUpload } from "../middleware/multer";
//get
router
  .route("/createProfile")
  .post(
    isAuthenticated,
    authorizedSupplier,
    singleUpload('profilePic'),
    supplier.createProfile
  );
router
  .route("/updateProfile")
  .put(isAuthenticated, authorizedSupplier, supplier.updateProfile);

export default router;
