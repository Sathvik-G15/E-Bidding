const cron = require("node-cron");
const Auction = require("../models/Auction");
const Bid = require("../models/Bid");
const User = require("../models/User");
const sendEmail = require("../utils/emailService");

const scheduleAuctionChecker = () => {
  cron.schedule("*/1 * * * *", async () => { // Runs every 1 minute
    try {
      console.log("⏳ Checking for ended auctions...");

      const now = new Date();
      const expiredAuctions = await Auction.find({ endTime: { $lte: now }, status: "pending" })
        .populate("bids"); // Fetch related bids

      if (expiredAuctions.length === 0) {
        console.log("✅ No auctions have ended.");
        return;
      }

      console.log(`🏁 Found ${expiredAuctions.length} auctions that have ended. Processing...`);

      for (const auction of expiredAuctions) {
        await declareWinner(auction);
      }
      
      console.log("🎉 Auction processing complete!");

    } catch (error) {
      console.error("❌ Error checking expired auctions:", error);
    }
  });
};

// Function to declare a winner and send email notifications
const declareWinner = async (auction) => {
  try {
    console.log(`🔍 Declaring winner for auction: ${auction.title}`);

    if (!auction.bids || auction.bids.length === 0) {
      console.log(`🚫 Auction "${auction.title}" ended with no bids.`);
      auction.status = "completed";
      auction.highestBidder = null;
      await auction.save();
      return;
    }

    // Find highest bid
    let highestBid = await Bid.findOne({ auction: auction._id })
      .sort({ amount: -1 }) // Highest bid first
      .populate("user");  // Get bidder details

    if (!highestBid || !highestBid.user) {
      console.log(`❌ Error: No valid bids found for "${auction.title}".`);
      auction.status = "completed";
      auction.highestBidder = null;
      await auction.save();
      return;
    }

    // ✅ Fetch winner's and seller's details
    const winner = await User.findById(highestBid.user._id);
    const seller = await User.findById(auction.seller);

    if (!winner) {
      console.log(`❌ Error: Winner user not found for "${auction.title}".`);
      auction.status = "completed";
      auction.highestBidder = null;
      await auction.save();
      return;
    }

    // ✅ Update auction with winner details
    auction.highestBid = highestBid.amount;
    auction.highestBidder = highestBid.user._id;
    auction.status = "completed";
    await auction.save();

    console.log(`🏆 Winner for "${auction.title}": ${winner.name} with $${highestBid.amount}`);

    // ✅ Send email to the **winner**
    if (winner.email) {
      sendEmail(
        winner.email,
        "🎉 Congratulations! You Won an Auction",
        `Dear ${winner.name},\n\nYou have won the auction "${auction.title}" with a final bid of $${highestBid.amount}.\n\nPlease contact the seller (${seller.email}) for further instructions.\n\nThank you for using our platform!`
      );
    }

    // ✅ Send email to the **seller**
    if (seller?.email) {
      sendEmail(
        seller.email,
        "🔔 Your Auction Has Ended",
        `Dear ${seller.name},\n\nYour auction "${auction.title}" has ended.\nThe highest bidder is ${winner.name} with a bid of $${highestBid.amount}.\n\nYou can now contact the winner (${winner.email}) to finalize the deal.\n\nThank you for using our platform!`
      );
    }

  } catch (error) {
    console.error("❌ Error declaring winners:", error);
  }
};

module.exports = scheduleAuctionChecker;