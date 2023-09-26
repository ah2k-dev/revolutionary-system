import mongoose, { Document } from "mongoose";

export interface ImportProductDocument extends Document {
  dropshipper: mongoose.Schema.Types.ObjectId;
  productId: mongoose.Schema.Types.ObjectId;
  title: string;
  desc: string;
  images: string[];
  slug: string;
  category: string;
  price: number;
  quantity: number;
  availableQuantity: number;
  itemWeight: number;
  weightUnit: string;
  size: number[];
  sku: string;
  ratings: number;
  isActive: boolean;
  //   new fields
  profit: number;
  sellingPrice: number;
  shippingPrice: number;
  shippingCountry: string;
  productTag: string[];
  collections: string[];
  variant: string;
  platform: string;
}
