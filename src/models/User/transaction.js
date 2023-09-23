const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  sendTo: { type: Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["deposit", "withdraw"] },
  amount: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
});

const transaction = mongoose.model("Transaction", transactionSchema);
module.exports = transaction;
