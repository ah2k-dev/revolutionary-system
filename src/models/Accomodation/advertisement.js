const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dotenv = require("dotenv");
dotenv.config({ path: ".././src/config/config.env" });

const advertisementSchema = new Schema(
  {
    host: { type: Schema.Types.ObjectId, ref: "User" },
    accommodation: { type: Schema.Types.ObjectId, ref: "Accomodation" },
    days: { type: Number, require: true },
    expiryDate: { type: Date, default: Date.now },
    amount: { type: Number, require: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
const advertisement = mongoose.model("Advertisement", advertisementSchema);
module.exports = advertisement;
