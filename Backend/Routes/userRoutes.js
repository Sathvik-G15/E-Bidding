const express = require("express");
const { verifyUser } = require("../Middleware/authMiddleware");
const { 
    getUserProfile, 
    updateUserProfile, 
    getUserBids, 
    getUserAuctions 
} = require("../controllers/userController");

const router = express.Router();

// Get User Profile
router.get("/profile", verifyUser, getUserProfile);
// try {
//     const user = await User.findById(req.user.id).select("-password"); // Exclude password
//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.json({
//       name: user.name,
//       email: user.email,
//       phone: user.phone,
//       bankInfo: user.bankInfo, // Assuming bank details exist in DB
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching user profile" });
//   }
// });

// Update User Profile
router.put("/profile", verifyUser, updateUserProfile);

// Get All Bids Placed by User
router.get("/bids", verifyUser, getUserBids);

// Get All Auctions Created by User
router.get("/auctions", verifyUser, getUserAuctions);

module.exports = router;
