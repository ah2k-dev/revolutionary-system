import { Request, Response } from "express";
import mongoose from "mongoose";
import ImportProduct from "../models/Dropshipper/importProducts";
// import User from "models/User/user";
import { ProductDocument } from "../types/models/Supplier/products.types";
import SuccessHandler from "../utils/SuccessHandler";
import ErrorHandler from "../utils/ErrorHandler";
import Product from "../models/Supplier/products";
import { ImportProductDocument } from "../types/models/Dropshipper/importProducts.types";

import { UpdateImportProductRequest } from "../types/controller/importProductController.types";

declare global {
  namespace Express {
    interface Request {
      product?: ProductDocument;
    }
  }
}
declare global {
  namespace Express {
    interface Request {
      importProduct?: ImportProductDocument;
    }
  }
}

//import  products
const importTheProduct = async (req: Request, res: Response) => {
  // #swagger.tags = ['importProduct']
  const currentUser: string = req.user._id;
  const { productId } = req.params;
  try {
    if (!mongoose.isValidObjectId(productId)) {
      return ErrorHandler("Invalid Product id", 400, req, res);
    }
    const product = await Product.findById(productId);

    console.log("product");
    console.log(product);
    const importProduct: ImportProductDocument = await ImportProduct.create({
      dropshipper: currentUser,
      productId: product._id,
      title: product.title,
      desc: product.desc,
      images: product.images,
      slug: product.slug,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      itemWeight: product.itemWeight,
      weightUnit: product.weightUnit,
      size: product.size,
      sku: product.sku,
    });

    return SuccessHandler(
      { message: "Product added to import list", importProduct },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
//Update Imported  products
const updateTheImportProduct = async (req: Request, res: Response) => {
  // #swagger.tags = ['importProduct']
  // TODO => Images
  const currentUser: string = req.user._id;
  const { importProductId } = req.params;
  try {
    const {
      title,
      desc,
      price,
      category,
      quantity,
      itemWeight,
      weightUnit,
      size,
      sku,
      profit,
      sellingPrice,
      shippingPrice,
      shippingCountry,
      productTag,
      collections,
      variant,
    }: UpdateImportProductRequest = req.body;
    if (!mongoose.isValidObjectId(importProductId)) {
      return ErrorHandler("Invalid Product id", 400, req, res);
    }
    const product = await ImportProduct.findOne({
      _id: importProductId,
      dropshipper: currentUser,
    });
    if (!product) {
      return ErrorHandler(
        "Product not found or You do not have the required privileges to update import products",
        404,
        req,
        res
      );
    }
    if (price < product.price) {
      return ErrorHandler(
        `Supplier's Product Price: ${product.price} cannot be less than Selling Price: ${price}`,
        401,
        req,
        res
      );
    }

    const updatedProduct: ImportProductDocument =
      await ImportProduct.findByIdAndUpdate(
        importProductId,

        {
          $set: {
            title,
            desc,
            price,
            category,
            quantity,
            itemWeight,
            weightUnit,
            size,
            sku,
            profit,
            sellingPrice,
            shippingPrice,
            shippingCountry,
            productTag,
            collections,
            variant,
          },
        }
      );

    return SuccessHandler(
      { message: "Updated the import product", updatedProduct },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

export { importTheProduct, updateTheImportProduct };
