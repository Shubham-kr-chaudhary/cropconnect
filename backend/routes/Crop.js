
// module.exports = router;
const express = require("express");
const Crop = require("../models/Crop");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// Get All Crops (Public Route)
router.get("/", async (req, res) => {
  try {
    const crops = await Crop.find().populate("farmer", "name");
    res.json(crops);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Create Crop (Protected Route - Only Authenticated Users)
router.post("/", verifyToken, async (req, res) => {
  // NOTE: Include 'unit' here!
  const { name, price, quantity, unit, genre, category } = req.body;

  try {
    const crop = await Crop.create({
      farmer: req.user.id,
      name,
      price,
      quantity,
      unit,      
      genre,
      category,
    });
    res.json(crop);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
