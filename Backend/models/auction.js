const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    startingBid: { type: Number, required: true },
    highestBid: { type: Number, default: 0 },
    highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    status: { type: String, enum: ["pending", "completed"], default: "pending" },
    startTime: { type: Date, required: true }, // ✅ Added startTime
    endTime: { type: Date, required: true },
    bids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bid" }],
    image: { type: String, required: true }, // Store image URL from Cloudinary
  },
  { timestamps: true }
);

module.exports = mongoose.model("Auction", auctionSchema);
