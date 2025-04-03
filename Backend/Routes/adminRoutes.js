const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Auction = require("../models/Auction");
const Bid = require("../models/Bid");
const Payment = require("../models/Payment");
const verifyAdmin = require("../Middleware/admin");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// 📌 Admin Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const admin = await User.findOne({ email: email });
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Access Denied: Not an Admin" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    console.error("🔥 Error in Admin Login:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// 📌 Get All Users
router.get("/users", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.get('/users/:id', verifyAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    // If the user is a regular user, they can only view their own profile.
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins or the user can view this profile.' });
    }

    const user = await User.findById(userId).select('-password'); // Exclude password field from response

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json(user); // Return user details
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// 📌 Update User Role
router.put("/users/:id", verifyAdmin, async (req, res) => {
  try {
    // Find the user by ID
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle the role
    user.role = user.role === "admin" ? "user" : "admin";
    await user.save();

    res.json({ message: `User role updated to ${user.role} successfully`, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});



// 📌 Delete a User
router.delete("/users/:id", verifyAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// 📌 Get All Auctions
router.get("/auctions", async (req, res) => {
  try {
    const auctions = await Auction.find()
      .populate("seller", "name email contact") // Populate seller details
      .select("title startTime endTime startingBid highestBid seller"); // Select required fields

    // Filter auctions where the seller exists
    const filteredAuctions = auctions.filter((auction) => auction.seller);

    if (filteredAuctions.length === 0) {
      return res.status(404).json({ message: "No auctions found with valid sellers" });
    }

    res.json(filteredAuctions);
  } catch (error) {
    console.error("Error fetching auctions:", error);
    res.status(500).json({ message: "Failed to fetch auctions" });
  }
});



// 📌 Delete an Auction
router.delete("/auctions/:id", verifyAdmin, async (req, res) => {
  try {
    await Auction.findByIdAndDelete(req.params.id);
    res.json({ message: "Auction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// 📌 Get All Bids for an Auction
router.get("/bids/:auctionId", verifyAdmin, async (req, res) => {
  try {
    const bids = await Bid.find({ auction: req.params.auctionId }).populate("user", "name email");
    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// 📌 Delete a Bid
router.delete("/bids/:id", verifyAdmin, async (req, res) => {
  try {
    await Bid.findByIdAndDelete(req.params.id);
    res.json({ message: "Bid deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// 📌 Get All Payments
router.get("/payments", verifyAdmin, async (req, res) => {
  try {
    const payments = await Payment.find().populate("user", "name email").populate("auction", "title");
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// 📌 Delete a Payment Record
router.delete("/payments/:id", verifyAdmin, async (req, res) => {
  try {
    await Payment.findByIdAndDelete(req.params.id);
    res.json({ message: "Payment record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
