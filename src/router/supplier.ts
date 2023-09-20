import { Router } from "express";
const router: Router = Router();
import isAuthenticated from "../middleware/auth";
import { authorizedSupplier } from "../middleware/role";
import * as supplier from "../controllers/supplierController";
import upload from "../utils/uploader";
//get
router
  .route("/createProfile")
  .post(
    isAuthenticated,
    authorizedSupplier,
    upload.single("profilePic"),
    supplier.createProfile
  );
router
  .route("/updateProfile")
  .put(
    isAuthenticated,
    authorizedSupplier,
    upload.single("profilePic"),
    supplier.updateProfile
  );
router
  .route("/profile")
  .get(isAuthenticated, authorizedSupplier, supplier.getProfile);

export default router;
