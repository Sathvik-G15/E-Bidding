const User = require("../models/User");
const Auction = require("../models/Auction");

// ✅ Get All Users (Admin Only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// ✅ Approve or Reject Auctions
const approveAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    auction.status = req.body.status; // "approved" or "rejected"
    await auction.save();
    res.json({ message: "Auction status updated" });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { getAllUsers, approveAuction };
