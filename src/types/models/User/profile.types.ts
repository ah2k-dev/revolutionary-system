import mongoose, { Document } from "mongoose";

export interface ProfileDocument extends Document {
  dropshipper: mongoose.Schema.Types.ObjectId;
  supplier: mongoose.Schema.Types.ObjectId;
  profilePic: string;
  dob: Date;
  country: string;
  city: string;
  address: string;
  zipCode: number;
  platform: string;
  storeUrl: string;
  accessToken: string;
  apiKey: string;
}
