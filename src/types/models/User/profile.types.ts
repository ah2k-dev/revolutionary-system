import mongoose, { Document } from "mongoose";

export interface ProfileDocument extends Document {
    user: mongoose.Schema.Types.ObjectId;
    profilePic: string;
    dob: Date;
    country: string;
    city: string;
    address: string;
    zipCode: number;
  }