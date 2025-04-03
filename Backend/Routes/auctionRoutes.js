const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Auction = require("../models/Auction");
const Bid = require("../models/Bid");
const User = require("../models/User");
const { verifyUser } = require("../Middleware/authMiddleware");


// =========================
// 🚀 CREATE AUCTION
// =========================
router.post("/create", verifyUser, async (req, res) => {
  try {
    const { title, description, startingBid, startTime, endTime, image } = req.body;

    if (!title || !description || !startingBid || !startTime || !endTime || !image) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const auction = new Auction({
      title,
      description,
      startingBid: parseFloat(startingBid),
      highestBid: parseFloat(startingBid),
      startTime,
      endTime,
      seller: req.user.id,
      image,
      bids: [],
    });

    await auction.save();

    // ✅ Update User's Auctions List
    await User.findByIdAndUpdate(req.user.id, {
      $push: { auctions: auction._id },
    });

    res.status(201).json({ message: "Auction created successfully", auction });
  } catch (error) {
    console.error("Error creating auction:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// =========================
// 🚀 GET ALL AUCTIONS
// =========================
router.get("/", async (req, res) => {
  try {
    const auctions = await Auction.find()
      .sort({ createdAt: -1 })
      .populate("seller", "name email _id");

    res.status(200).json(auctions);
  } catch (error) {
    console.error("Error fetching auctions:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// =========================
// 🚀 GET MY AUCTIONS (Logged-in User)
// =========================
router.get("/my-auctions", verifyUser, async (req, res) => {
  try {
    const auctions = await Auction.find({ seller: req.user.id }).sort({ createdAt: -1 });
    res.json(auctions);
  } catch (error) {
    console.error("Error fetching user auctions:", error);
    res.status(500).json({ message: "Error fetching auctions" });
  }
});

// =========================
// 🚀 PLACE A BID
// =========================
router.post("/:id/bid", verifyUser, async (req, res) => {
  try {
    const { bidAmount } = req.body;
    const userId = req.user.id;
    const { id: auctionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(auctionId)) {
      return res.status(400).json({ message: "Invalid auction ID" });
    }

    const auction = await Auction.findById(auctionId);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    const now = new Date();

    // 🚨 Prevent bidding before the auction starts
    if (now < new Date(auction.startTime)) {
      return res.status(400).json({ message: "Bidding has not started yet" });
    }

    // 🚨 Prevent bidding after the auction ends
    if (now > new Date(auction.endTime)) {
      return res.status(400).json({ message: "Bidding has ended for this auction" });
    }

    // 🚨 Ensure bid is higher than the current highest bid
    if (bidAmount <= auction.highestBid) {
      return res.status(400).json({ message: "Bid must be higher than the current bid" });
    }

    // ✅ Create and save a new bid
    const newBid = new Bid({
      user: userId,
      auction: auctionId,
      amount: parseFloat(bidAmount),
      timestamp: now,
    });
    await newBid.save();

    // ✅ Update auction with new highest bid
    auction.bids.push(newBid._id);
    auction.highestBid = parseFloat(bidAmount);
    auction.highestBidder = userId;
    await auction.save();

    // ✅ Update User's bid history
    await User.findByIdAndUpdate(userId, {
      $push: { bids: newBid._id },
    });

    // ✅ Emit bid update via WebSocket (if using socket.io)
    if (req.app.io) {
      req.app.io.emit("auctionUpdated", {
        auctionId,
        highestBid: auction.highestBid,
      });
    }

    res.status(200).json({ message: "Bid placed successfully", newBid });
  } catch (error) {
    console.error("Error placing bid:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// =========================
// 🚀 GET AUCTION DETAILS (Includes Bids)
// =========================
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid auction ID" });
    }

    const auction = await Auction.findById(req.params.id)
      .populate({
        path: "bids",
        populate: { path: "user", select: "name email" }, // Populate bidder details
      })
      .populate("seller", "name email"); // Populate seller info

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    // ✅ Get the highest bid dynamically
    const highestBid = auction.bids.length > 0
      ? Math.max(...auction.bids.map(bid => bid.amount))
      : auction.startingBid;

    res.status(200).json({ 
      ...auction.toObject(), 
      highestBid,
    });
  } catch (error) {
    console.error("Error fetching auction:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// =========================
// 🚀 GET BID HISTORY OF AN AUCTION
// =========================
router.get("/:id/bid", async (req, res) => {
  try {
    const auctionId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(auctionId)) {
      return res.status(400).json({ message: "Invalid auction ID format" });
    }

    const auction = await Auction.findById(auctionId).populate({
      path: "bids",
      populate: { path: "user", select: "name email" }, // Include bidder details
    });

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    res.status(200).json({ bids: auction.bids, highestBid: auction.highestBid });
  } catch (error) {
    console.error("Error fetching bid history:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/active", async (req, res) => {
  try {
    const now = new Date();

    const activeAuctions = await Auction.find({
      startTime: { $lte: now },  // Auction has started
      endTime: { $gte: now },    // Auction has not ended
      status: "approved",        // Ensure auction is approved
    }).sort({ startTime: 1 });

    res.status(200).json(activeAuctions);
  } catch (error) {
    console.error("Error fetching active auctions:", error);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
