import mongoose, { Document } from "mongoose";

export interface ProductDocument extends Document {
  supplier: mongoose.Schema.Types.ObjectId;
  title: string;
  desc: string;
  images: string[];
  slug: string;
  category: string;
  price: number;
  quantity: number;
  availableQuantity: number;
  itemWeight: number;
  size: number[];
  sku: string;
  ratings: number;
  isActive: boolean;
  weightUnit: string;
}
