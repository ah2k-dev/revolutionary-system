const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dotenv = require("dotenv");
dotenv.config({ path: ".././src/config/config.env" });

const accomodationSchema = new Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  capacity: { type: Number, required: true },
  location: {
    latitude: {type: String, required: true},
    longitude: {type: String, required: true},
  },
  createdBy: { type: String },
  services: {type: [String]},
  reviewsId: {type: [String]},
  images: {type: [String]},
  isActive: { type: Boolean, default: true },
  // isDeleted: { type: Boolean, default: false },

}, {timestamps: true});

const accomodation = mongoose.model("accomodation", accomodationSchema);

module.exports = accomodation;
