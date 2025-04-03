require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("express").json;
const logger = require("./utils/logger");
const http = require("http");
const { Server } = require("socket.io");
const scheduleAuctionChecker = require("./utils/auctionScheduler");
const verifyAdmin = require("./Middleware/admin");


// Import Routes
const authRoutes = require("./Routes/authRoutes");
const userRoutes = require("./Routes/userRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const auctionRoutes = require("./Routes/auctionRoutes");
//const paymentRoutes = require("./routes/paymentRoutes");


// Initialize Express App
const app = express();

// Middleware
app.use(cors({origin:"*"}));
app.use(morgan("dev"));
app.use(bodyParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auctions", auctionRoutes);
//app.use("/api/payments", paymentRoutes);

// Auction Handlers

scheduleAuctionChecker();

// Error Handling Middleware
app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

const server = http.createServer(app);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI,)
  .then(() => {
    console.log("✅ MongoDB Connected");

    
  })
  .catch((error) => {
    logger.error("MongoDB Connection Error: " + error);
  });
   // Start Server
   const PORT = process.env.PORT || 4000;
   app.listen(PORT, () => {
     console.log(`🚀 Server running on port ${PORT}`);
   });

  


