const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dotenv = require("dotenv");
dotenv.config({ path: ".././src/config/config.env" });

const accomodationSchema = new Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  capacity: { type: Number, required: true },
  // location: {
  //   latitude: {type: Number, required: true},
  //   longitude: {type: Number, required: true},
  // },

  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  
  createdBy: { type: String },
  services: {type: [String]},
  reviewsId: {type: [String]},
  images: {type: [String]},
  isActive: { type: Boolean, default: true },
  // isDeleted: { type: Boolean, default: false },

}, {timestamps: true});

accomodationSchema.index({ location: '2dsphere' });

const accomodation = mongoose.model("accomodation", accomodationSchema);

module.exports = accomodation;
