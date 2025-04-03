const User = require("../models/User");

// ✅ Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// ✅ Update User Profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// ✅ Get User's Bids
const getUserBids = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("bids");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.bids);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// ✅ Get User's Auctions
const getUserAuctions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("auctions");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.auctions);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { getUserProfile, updateUserProfile, getUserBids, getUserAuctions };
