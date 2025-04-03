const Auction = require("../models/Auction");

// ✅ Create an Auction
const createAuction = async (req, res) => {
  try {
    const newAuction = new Auction({
      seller: req.user.id,
      title: req.body.title,
      description: req.body.description,
      startingBid: req.body.startingBid,
      endTime: req.body.endTime,
      status: "pending",
    });

    const auction = await newAuction.save();
    res.status(201).json(auction);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// ✅ Get All Active Auctions
const getActiveAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({ status: "approved", endTime: { $gt: Date.now() } });
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// ✅ Place a Bid
const placeBid = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    if (req.body.bidAmount <= auction.highestBid) {
      return res.status(400).json({ message: "Bid must be higher than the current highest bid" });
    }

    auction.highestBid = req.body.bidAmount;
    auction.highestBidder = req.user.id;
    await auction.save();

    res.json({ message: "Bid placed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { createAuction, getActiveAuctions, placeBid };
