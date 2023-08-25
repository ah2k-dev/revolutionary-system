const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const validator = require("validator");
dotenv.config({ path: ".././src/config/config.env" });
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },

  username: { type: String, unique: true },

  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },
  password: {
    type: String,
  },

  phoneNumber: {
    type: String,
  },

  role: {
    type: String,
    enum: ["user", "host", "cook"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
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

  avatar: { type: String },
  coverImg: { type: String },

  userDesc: { type: String },
  country: { type: String, requried: true },
  timeZone: { type: String },
  websiteLink: { type: String },

  provider: {
    type: String,
    default: "local",
    enum: ["google", "facebook", "local"],
  },

  location: {
    type: { type: String, default: "Point" },
    coordinates: [Number],
  },
  // Shop Related Fields
  shopName: { type: String, unique: true },
  shopDesc: { type: String },
  shopBanner: {
    type: String,
    // default:
    //   "https://img.freepik.com/free-vector/flat-design-food-sale-background_23-2149167390.jpg",
  },
  shopRating: { type: Number },
  savedAccomodation: [{ type: Schema.Types.ObjectId, ref: "Accomodation" }],

  savedMeal: [{ type: Schema.Types.ObjectId, ref: "Meal" }],
  savedCooks: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

// Only add the location field if the role is "cook"
// if (userSchema.role === "cook") {
// userSchema.add({
//   location: {
//     type: { type: String, default: "Point" },
//     coordinates: [Number],
//   },
//   // Shop Related Fields
//   shopName: { type: String, unique: true },
//   shopDesc: { type: String },
//   shopBanner: {
//     type: String,
//     default:
//       "https://img.freepik.com/free-vector/flat-design-food-sale-background_23-2149167390.jpg",
//   },
//   shopRating: { type: Number },
// });
// console.log("I am Cook");

//hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//jwtToken
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

//compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.index({ location: "2dsphere" });
const user = mongoose.model("User", userSchema);
module.exports = user;
