import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".././src/config/config.env" });
import { ProfileDocument } from "../../types/models/User/profile.types";

const profileSchema = new Schema<ProfileDocument>(
  {
    dropshipper: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    profilePic: {
      type: String,
      // default:
      //   "https://cdn.dribbble.com/users/279765/screenshots/1107998/ironman_ios_2x_.png",
    },
    dob: {
      type: Date,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    zipCode: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const profile = mongoose.model<ProfileDocument>("Profile", profileSchema);

export default profile;
