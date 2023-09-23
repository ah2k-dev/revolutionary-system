const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const walletSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    transaction: [{ type: Schema.ObjectId, ref: "Transaction" }],
    balance: { type: String },
    withDrawAmount: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const wallet = mongoose.model("Wallet", walletSchema);
module.exports = wallet;
