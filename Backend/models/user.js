const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: Number, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    bids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bid" }],
    auctions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Auction" }],
    status: {type: String, enum: ["Active", "Inactive"],  default:"Active"},

    // Bank Details
    bankDetails: {
      accountNumber: { type: String, required: true },
      bankName: { type: String, required: true },
      ifscCode: { type: String, required: true },
      accountHolderName: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
