const express = require("express");
const Crop = require("../models/crop");
const router = express.Router();

// Get All Crops
router.get("/", async (req, res) => {
  const crops = await Crop.find().populate("farmer", "name");
  res.json(crops);
});

// Create Crop
router.post("/", async (req, res) => {
  const { farmer, name, price, quantity } = req.body;
  try {
    const crop = await Crop.create({ farmer, name, price, quantity });
    res.json(crop);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
