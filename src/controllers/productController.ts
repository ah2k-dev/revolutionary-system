import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/User/user";
import Product from "../models/Supplier/products";
import { ProductDocument } from "../types/models/Supplier/products.types";
import { UserDocument } from "../types/models/User/user.types";
import SuccessHandler from "../utils/SuccessHandler";
import ErrorHandler from "../utils/ErrorHandler";
import { CreateProductRequest } from "../types/controller/productController.types";
import slugify from "slugify";
import moment from "moment";

declare global {
  namespace Express {
    interface Request {
      product?: ProductDocument;
    }
  }
}

//create product
const createProduct = async (req: Request, res: Response) => {
  // #swagger.tags = ['product']
  // TODO images
  const currentUser: string = req.user._id;
  try {
    const {
      title,
      desc,
      brand,
      category,
      price,
      quantity,
      itemWeight,
      size,
      sku,
    }: CreateProductRequest = req.body;

    const user: UserDocument | null = await User.findById(currentUser);
    if (!user) {
      return ErrorHandler("User doesn't exist", 400, req, res);
    }
    // create a slug from the title
    let slug = slugify(title, {
      replacement: "-",
      lower: true,
      strict: false,
      trim: true,
      remove: /[^a-zA-Z0-9\s]/g,
    }).toString();
    // creating unique slug

    const getSlug = await Product.find({
      isActive: true,
      slug: slug,
    }).select("slug");

    if (getSlug.length > 0 && getSlug[0].slug) {
      const uniqueId: string = Date.now().toString().slice(-4);
      slug = `${slug}-${uniqueId}`;
    }

    const images = req.file ? req.file.filename : null;
    const product = await Product.create({
      supplier: currentUser,
      slug,
      title,
      desc,
      brand,
      images: [images],
      category,
      price,
      quantity,
      itemWeight,
      size,
      sku,
      availableQuantity: quantity,
    });
    return SuccessHandler(
      { message: "Product created successfully", product },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
//Get products
const getProducts = async (req: Request, res: Response) => {
  // #swagger.tags = ['product']

  try {
    //✅ Price Filter
    const priceFilter =
      req.body.price && req.body.price.length > 0
        ? {
            price: {
              $gte: Number(req.body.price[0]),
              $lte: Number(req.body.price[1]),
            },
          }
        : {};
    //✅ Search Filter
    const searchProductFilter = req.body.search
      ? {
          $or: [
            {
              title: { $regex: req.body.search, $options: "i" },
            },
            {
              desc: { $regex: req.body.search, $options: "i" },
            },
          ],
        }
      : {};
    //✅ Category Filter
    const categoryFilter = req.body.category
      ? {
          category: { $regex: req.body.category, $options: "i" },
        }
      : {};
    //✅ Date Filter
    let startDate;
    let endDate;

    if (req.body.date) {
      startDate = moment(req.body.date[0]).startOf("day").format();
      endDate = moment(req.body.date[1]).endOf("day").format();
    }
    const dateFilter =
      req.body.date && req.body.date.length > 0
        ? {
            createdAt: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
            // updatedAt: {
            //   $lte: new Date(endDate),
            // },
          }
        : {};

    const products: ProductDocument[] = await Product.find({
      isActive: true,
      ...priceFilter,
      ...searchProductFilter,
      ...categoryFilter,
      ...dateFilter,
    });
    const productCount = products.length;
    return SuccessHandler(
      { message: "Products fetched successfully", productCount, products },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

// Update Product
const updateProduct = async (req: Request, res: Response) => {
  // #swagger.tags = ['product']
  // TODO images
  const currentUser: string = req.user._id;
  const { productId } = req.params;
  try {
    const {
      title,
      desc,
      brand,
      category,
      price,
      quantity,
      itemWeight,
      size,
      sku,
    }: CreateProductRequest = req.body;
    console.log(req.body);

    if (!mongoose.isValidObjectId(productId)) {
      return ErrorHandler("Invalid Product id", 400, req, res);
    }

    const user: UserDocument | null = await User.findById(currentUser);
    if (!user) {
      return ErrorHandler("User doesn't exist", 400, req, res);
    }

    // create a slug from the title
    let slug = slugify(title, {
      replacement: "-",
      lower: true,
      strict: false,
      trim: true,
      remove: /[^a-zA-Z0-9\s]/g,
    }).toString();
    // creating unique slug

    const getSlug: ProductDocument[] = await Product.find({
      isActive: true,
      slug: slug,
    }).select("slug");

    if (getSlug.length > 0 && getSlug[0].slug) {
      const uniqueId: string = Date.now().toString().slice(-4);
      slug = `${slug}-${uniqueId}`;
    }

    // const images = req.file ? req.file.filename : null;
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, supplier: currentUser, isActive: true },

      {
        $set: {
          slug,
          title,
          desc,
          brand,
          // images: [images],
          category,
          price,
          quantity,
          itemWeight,
          size,
          sku,
        },
      }
    );
    return SuccessHandler(
      { message: "Product updated successfully", updatedProduct },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
// Delete Product
const deleteProduct = async (req: Request, res: Response) => {
  // #swagger.tags = ['product']
  const currentUser: string = req.user._id;
  const { productId } = req.params;
  try {
    if (!mongoose.isValidObjectId(productId)) {
      return ErrorHandler("Invalid Product id", 400, req, res);
    }

    const user: UserDocument | null = await User.findById(currentUser);
    if (!user) {
      return ErrorHandler("User doesn't exist", 400, req, res);
    }

    await Product.findOneAndUpdate(
      { _id: productId, supplier: currentUser, isActive: true },

      {
        $set: {
          isActive: false,
        },
      }
    );
    return SuccessHandler(
      { message: "Product deleted successfully" },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

export { createProduct, getProducts, updateProduct, deleteProduct };
