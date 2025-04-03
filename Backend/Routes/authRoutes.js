const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // Import User model
const router = express.Router();
const jwt = require("jsonwebtoken")

// @route   POST /api/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { name, email, contact, password, bankDetails } = req.body;

    // Validate required fields
    if (!name || !email || !contact || !password || !bankDetails) {
      return res.status(400).json({ message: "All fields, including bank details, are required." });
    }

    if (!bankDetails.accountHolderName || !bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.ifscCode) {
      return res.status(400).json({ message: "Complete bank details are required." });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance
    user = new User({
      name,
      email,
      contact,
      password: hashedPassword,
      bankDetails: {
        accountHolderName: bankDetails.accountHolderName,
        bankName: bankDetails.bankName,
        accountNumber: bankDetails.accountNumber,
        ifscCode: bankDetails.ifscCode,
      },
    });

    // Save the user to the database
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error in registration:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/login
// @desc    Authenticate user & return user details
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET, // Ensure this is set in your .env
      { expiresIn: "1h" }
    );

    res.status(200).json({ token }); // Ensure this key matches frontend expectation
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
