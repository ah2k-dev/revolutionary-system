const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dotenv = require("dotenv");
dotenv.config({ path: ".././src/config/config.env" });

const hostSchema = new Schema({
  title: { type: String, required: true },
  desc: { type: String },
  availability: { type: Date },
  capacity: { type: String },
  location: { type: String },
  createdAt: { type: Date, default: Date.now() },
  createdBy: { type: String },
  images: [{ url: { type: String, default: "url" } }],
});

const host = mongoose.model("host", hostSchema);

module.exports = host;
