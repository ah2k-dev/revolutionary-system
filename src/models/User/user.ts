import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import validator from "validator";
dotenv.config({ path: ".././src/config/config.env" });
import {UserDocument} from '../../types/models/User/user.types'


const userSchema = new Schema<UserDocument>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value: string) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["supplier", "dropshipper"],
    default: "supplier",
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: Number,
  },
  emailVerificationTokenExpires: {
    type: Date,
  },
  passwordResetToken: {
    type: Number,
  },
  passwordResetTokenExpires: {
    type: Date,
  },
  lastLogin: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

// Hash password before saving
userSchema.pre("save", async function (this: UserDocument, next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// JWT Token
userSchema.methods.getJWTToken = function (this: UserDocument) {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

// Compare password
userSchema.methods.comparePassword = async function (
  this: UserDocument,
  enteredPassword: string
) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
