const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Crop = require("../models/Crop");
const verifyToken = require("../middleware/authMiddleware");

// POST /api/orders - Create a new order (firm only)
router.post("/", verifyToken, async (req, res) => {
  try {
    // 1. Check if user is a "firm"
    if (req.user.role !== "firm") {
      return res.status(403).json({ error: "Only firm can create orders." });
    }

    const { cropId, quantity } = req.body;
    // 2. Find the crop
    const crop = await Crop.findById(cropId);
    if (!crop) {
      return res.status(404).json({ error: "Crop not found." });
    }

    // 3. Calculate totalPrice = crop.price * quantity
    //    (assuming crop.price is in INR)
    const totalPrice = crop.price * quantity;

    // 4. Create the order
    const order = await Order.create({
      buyer: req.user.id,
      crop: crop._id,
      quantity,
      totalPrice
    });

    res.json(order);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/orders - Get all orders for the logged-in user (firm)
router.get("/", verifyToken, async (req, res) => {
  try {
    // If user is "firm", fetch orders where buyer = user.id
    if (req.user.role === "firm") {
      const orders = await Order.find({ buyer: req.user.id })
        .populate("crop", "name price genre category quantity unit")
        .sort({ createdAt: -1 });

      return res.json(orders);
    }

    // If user is "farmer", maybe show orders for crops they sold? (Optional)
    // For now, we just return []
    res.json([]);
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
