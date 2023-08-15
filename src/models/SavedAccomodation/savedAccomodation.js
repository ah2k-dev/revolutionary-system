const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dotenv = require("dotenv");
dotenv.config({ path: ".././src/config/config.env" });
const validator = require('validator');



const savedAccomodationSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    accommodationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Accommodation' },
  },
  { timestamps: true }
);

const savedAccomodation = mongoose.model("SavedAccomodation", savedAccomodationSchema);

module.exports = savedAccomodation;
