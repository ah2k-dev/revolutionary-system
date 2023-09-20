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
import { authorizedSupplier } from "../middleware/role";
import * as shopify from "../controllers/shopifyController";
//post
router.route("/importProducts").post(shopify.importProducts);
router.route("/deleteProduct/:productId").post(shopify.deleteProduct);
router.route("/webhooks").post(shopify.deleteProduct);
//get
router.route("/getProducts").get(shopify.getShopifyProducts);
router.route("/product/:productId").get(shopify.getSingleProduct);
//put
router.route("/updateProduct/:productId").put(shopify.updateProduct);
//delete
router.route("/deleteProduct/:productId").delete(shopify.deleteProduct);

export default router;
