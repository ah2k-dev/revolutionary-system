import dotenv from "dotenv";
dotenv.config({ path: "../config/config.env" });
import { Request, Response } from "express";
import Profile from "../models/User/profile";
import User from "../models/User/user";
import { ProfileDocument } from "../types/models/User/profile.types";
import SuccessHandler from "../utils/SuccessHandler";
import ErrorHandler from "../utils/ErrorHandler";
import Shopify from "shopify-api-node";
import { UserDocument } from "../types/models/User/user.types";
import ImportProduct from "../models/Dropshipper/importProducts";

declare global {
  namespace Express {
    interface Request {
      profile?: ProfileDocument;
    }
  }
}
const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

const shopify = new Shopify({
  shopName: "bcda5b.myshopify.com",
  apiKey: process.env.SHOPIFY_API_KEY,
  password: process.env.SHOPIFY_ACCESS_TOKEN,
});
//Import Product
const importProductToShopify = async (req: Request, res: Response) => {
  // #swagger.tags = ['shopify']
  const currentUser = req.user._id;
  const { id } = req.params;
  console.log(id);
  const importProduct = await ImportProduct.findOne({
    _id: id,
    dropshipper: currentUser,
  });
  console.log("importProduct.title: ", importProduct.title);

  try {
    const newProduct = {
      _id: importProduct._id,
      title: importProduct.title,
      body_html: `<p>${importProduct.desc}</p>`,
      // vendor: importProduct.firstName+ importProduct.lastName,
      product_type: importProduct.category,
      status: importProduct.isActive === true ? "active" : "inActive",
      tags: importProduct.productTag.join(", "),
      // collections: importProduct.collections.map((col) => ({ title: col })),
      collections: importProduct.collections.map((col) => col),
      // images: importProduct.images.map((img) => ({ src: img })),
      images: importProduct.images.map((img) => img),
      // images: [
      //   {
      //     src: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
      //   },
      //   {
      //     src: "https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg",
      //   },
      // ],
      shipping_country: importProduct.shippingCountry,
      item_weight: importProduct.itemWeight,
      weight_unit: importProduct.weightUnit,
      sizes: importProduct.size,
      // image_srcs: []

      variants: [
        {
          price: importProduct.sellingPrice,
          inventory_quantity: 13,
          sku: importProduct.sku,
          option1: importProduct.variant,
        },
      ],
    };

    // const newProduct = {
    //   title: "123 Nike Air Zoom",
    //   body_html:
    //     "<p>Elevate your running experience with the Nike Air Zoom Pegasus 38. Engineered to deliver both comfort and performance, these men's running shoes are the perfect choice for athletes and enthusiasts alike.</p>",
    //   vendor: "DoClick",
    //   product_type: "Physical",
    //   images: [
    //     {
    //       src: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
    //     },
    //     {
    //       src: "https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg",
    //     },
    //   ],
    //   variants: [
    //     {
    //       price: 3200,
    //       inventory_quantity: 13,
    //     },
    //   ],
    // };

    const product = await shopify.product.create(newProduct);
    await ImportProduct.findByIdAndUpdate(id, { platform: "shopify" });

    return SuccessHandler(
      { message: "Product created successfully", product },
      // { message: "product created successfully", importProduct, newProduct },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getShopifyProducts = async (req: Request, res: Response) => {
  // #swagger.tags = ['shopify']
  try {
    const products = await shopify.product.list();
    let productCount = products.length;

    return SuccessHandler(
      {
        message: "product fetched successfully",
        productCount,
        products,
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getSingleProduct = async (req: Request, res: Response) => {
  // #swagger.tags = ['shopify']
  const id: number = Number(req.params.id);
  try {
    const product = await shopify.product.get(id);
    return SuccessHandler(
      {
        message: "Single Product fetched successfully",
        product,
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
const updateProduct = async (req: Request, res: Response) => {
  // #swagger.tags = ['shopify']
  const id: number = Number(req.params.id);
  console.log(id);

  try {
    const product = await shopify.product.get(id);
    if (product) {
      const updateProductData = {
        // Use a different variable name to avoid shadowing
        title: product.title,
        body_html: `<p>${product.desc}</p>`,
        // vendor: importProduct.firstName + importProduct.lastName,
        product_type: product.category,
        status: product.isActive === true ? "active" : "inActive",
        tags: product.productTag.join(", "),
        // collections: importProduct.collections.map((col) => ({ title: col })),
        collections: product.collections.map((col) => col),
        // images: importProduct.images.map((img) => ({ src: img })),
        images: product.images.map((img) => img),
        shipping_country: product.shippingCountry,
        item_weight: product.itemWeight,
        weight_unit: product.weightUnit,
        sizes: product.size,
        // image_srcs: []

        variants: [
          {
            price: product.sellingPrice,
            inventory_quantity: 13,
            sku: product.sku,
            option1: product.variant,
          },
        ],
      };
      const updatedProduct = await shopify.product.update(
        id,
        updateProductData
      );
      return SuccessHandler(
        {
          message: "Product updated successfully",
          updatedProduct,
        },
        200,
        res
      );
    } else {
      // Handle case where the product with the given ID was not found
      return ErrorHandler("Product not found", 404, req, res);
    }
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  // #swagger.tags = ['shopify']
  const productId: number = Number(req.params.productId);
  try {
    const product = await shopify.product.delete(productId);
    return SuccessHandler(
      {
        message: "Product deleted successfully",
        product,
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getShopifyWebhooks = async (req: Request, res: Response) => {
  try {
    const webhooks = await shopify.webhook.list();
    return SuccessHandler(
      {
        message: "Single Product fetched successfully",
        webhooks,
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

export {
  importProductToShopify,
  getShopifyProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getShopifyWebhooks,
};
