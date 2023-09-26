import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".././src/config/config.env" });
import { ImportProductDocument } from "../../types/models/Dropshipper/importProducts.types";

const importedProductSchema = new Schema<ImportProductDocument>(
  {
    dropshipper: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },

    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      // required: true,
      // default:
      //   "https://img.freepik.com/free-photo/chicken-skewers-with-slices-sweet-peppers-dill_2829-18813.jpg?size=626&ext=jpg",
    },
    slug: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    availableQuantity: {
      type: Number,
      default: 0,
    },
    itemWeight: {
      type: Number,
      default: 0,
    },
    weightUnit: {
      type: String,
    },
    size: {
      type: [Number],
    },
    sku: {
      type: String,
      default: "",
    },
    ratings: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // new fields
    profit: {
      type: Number,
      default: 0,
    },
    sellingPrice: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    shippingCountry: {
      type: String,
    },
    productTag: {
      type: [String],
    },
    collections: {
      type: [String],
    },
    variant: {
      type: String,
    },

    platform: {
      type: String,
      enum: ["shopify", "woocommerce", "none"],
      default: "none",
    },
  },
  { timestamps: true }
);

const importedProducts = mongoose.model<ImportProductDocument>(
  "ImportedProduct",
  importedProductSchema
);

export default importedProducts;
