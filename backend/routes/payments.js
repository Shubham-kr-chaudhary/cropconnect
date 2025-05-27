const express = require("express");
const Razorpay = require("razorpay");
const Crop     = require("../models/Crop");
const Order    = require("../models/Order");
const verify   = require("../middleware/authMiddleware");

const router = express.Router();

const razorpay = new Razorpay({
  key_id:    process.env.RZP_KEY_ID,
  key_secret:process.env.RZP_KEY_SECRET,
});

// POST /api/payments/create-order
// Body: { cropId, quantity }
router.post("/create-order", verify, async (req, res) => {
  try {
    if (req.user.role !== "firm")
      return res.status(403).json({ error: "Only firms can purchase." });

    const { cropId, quantity } = req.body;
    if (!cropId || !quantity)
      return res.status(400).json({ error: "cropId & quantity required" });

    const crop = await Crop.findById(cropId);
    if (!crop) return res.status(404).json({ error: "Crop not found" });

    const totalPrice = crop.price * quantity;

    // 1️⃣ create a Pending order in Mongo
    const order = await Order.create({
      buyer:      req.user.id,
      crop:       crop._id,
      quantity,
      totalPrice,
      status:     "Pending",
    });

    // 2️⃣ create a Razorpay order (amount in paise)
    const razorpayOrder = await razorpay.orders.create({
      amount:   totalPrice * 100,
      currency: "INR",
      receipt:  `rcpt_${order._id}`, 
    });

    // 3️⃣ return everything the frontend needs
    res.json({
      mongoOrderId:   order._id.toString(),
      razorpayOrderId:razorpayOrder.id,
      amount:         razorpayOrder.amount,
      currency:       razorpayOrder.currency,
    });
  } catch (err) {
    console.error("Create-order error:", err);
    res.status(500).json({ error: "Could not create order" });
  }
});

module.exports = router;
