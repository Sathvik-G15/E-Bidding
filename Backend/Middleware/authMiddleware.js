const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to verify user authentication
const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; // Extract token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password"); // Remove password field

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    req.user = user; // Attach user to request object
    next();
  } catch (error) {
    console.error("❌ Authentication Error:", error.message);
    res.status(401).json({ message: "Invalid or Expired Token" });
  }
};

// Middleware to check if the user is an admin
const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access Denied. Admins only." });
  }
};

module.exports = { verifyUser, verifyAdmin };
