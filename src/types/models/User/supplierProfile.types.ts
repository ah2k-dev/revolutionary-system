import mongoose, { Document } from "mongoose";

export interface SupplierProfileDocument extends Document {
    user: mongoose.Schema.Types.ObjectId;
    dob: Date;
    country: string;
    city: string;
    address: string;
    zipCode: number;
  }