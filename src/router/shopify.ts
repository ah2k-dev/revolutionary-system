// import { Router } from "express";
// const router: Router = Router();
// import isAuthenticated from "../middleware/auth";
// import { authorizedSupplier } from "../middleware/role";
// import * as shopify from "../controllers/shopify";
// //get
// router.route("/token").post(shopify.redirectToUrl);
// router.route("/token1").post(shopify.retrieveAccessToken);
// export default router;

import { Router } from "express";
const router: Router = Router();
import isAuthenticated from "../middleware/auth";
import { authorizedDropshipper } from "../middleware/role";
import * as shopify from "../controllers/shopifyController";
//post
router
  .route("/importProduct/:id")
  .post(isAuthenticated, authorizedDropshipper, shopify.importProductToShopify);
router.route("/deleteProduct/:id").post(isAuthenticated, shopify.deleteProduct);
router.route("/webhooks").post(isAuthenticated, shopify.deleteProduct);
//get
router.route("/getProducts").get(shopify.getShopifyProducts);
router.route("/product/:id").get(shopify.getSingleProduct);
//put
router.route("/updateProduct/:id").put(shopify.updateProduct);
//delete
router.route("/deleteProduct/:id").delete(shopify.deleteProduct);

export default router;
