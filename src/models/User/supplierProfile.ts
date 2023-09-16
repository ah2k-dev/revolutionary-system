import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".././src/config/config.env" });
import {SupplierProfileDocument} from '../../types/models/User/supplierProfile.types'


const supplierProfileSchema = new Schema<SupplierProfileDocument>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

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

});


const supplierProfile = mongoose.model<SupplierProfileDocument>("SupplierProfile", supplierProfileSchema);

export default supplierProfile;
