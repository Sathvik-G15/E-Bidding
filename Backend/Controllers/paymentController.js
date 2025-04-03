const Payment = require("../models/payment");

// ✅ Process Payment
const processPayment = async (req, res) => {
  try {
    const newPayment = new Payment({
      user: req.user.id,
      auction: req.body.auctionId,
      amount: req.body.amount,
      status: "completed",
    });

    const payment = await newPayment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: "Payment failed" });
  }
};

// ✅ Get Payment History
const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { processPayment, getPaymentHistory };
