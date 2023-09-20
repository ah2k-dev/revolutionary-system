import express from "express";
const router = express.Router();
import auth from "./auth";
import dropshipper from "./dropshipper";
import supplier from "./supplier";
import product from "./product";
import shopify from "./shopify";
import importProduct from "./importProduct";

router.use("/auth", auth);
router.use("/dropshipper", dropshipper);
router.use("/supplier", supplier);
router.use("/product", product);
router.use("/shopify", shopify);
router.use("/importProduct", importProduct);

export default router;
