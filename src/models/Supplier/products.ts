import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".././src/config/config.env" });
import { ProductDocument } from "../../types/models/Supplier/products.types";

const productSchema = new Schema<ProductDocument>(
  {
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    // brand: {
    //   type: String,
    //   required: true,
    // },
    images: {
      type: [String],
      required: true,
      // default:"https://img.freepik.com/free-photo/chicken-skewers-with-slices-sweet-peppers-dill_2829-18813.jpg?size=626&ext=jpg"
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
  },
  { timestamps: true }
);

const products = mongoose.model<ProductDocument>("Product", productSchema);

export default products;
