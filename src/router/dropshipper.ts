import { Router } from "express";
const router: Router = Router();
import isAuthenticated from "../middleware/auth";
import { authorizedDropshipper } from "../middleware/role";
import * as dropshipper from "../controllers/dropshipperController";
import upload from "../utils/uploader";
//get
router
  .route("/createProfile")
  .post(
    isAuthenticated,
    authorizedDropshipper,
    upload.single("profilePic"),
    dropshipper.createProfile
  );
router.route("/updateProfile").put(
  isAuthenticated,
  authorizedDropshipper,
  upload.single("profilePic"),

  dropshipper.updateProfile
);
router
  .route("/profile")
  .get(isAuthenticated, authorizedDropshipper, dropshipper.getProfile);

export default router;
