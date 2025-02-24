// const express = require("express");
// const Crop = require("../models/Crop");
// const router = express.Router();

// // Get All Crops
// router.get("/", async (req, res) => {
//   const crops = await Crop.find().populate("farmer", "name");
//   res.json(crops);
// });

// // Create Crop
// router.post("/", async (req, res) => {
//   const { farmer, name, price, quantity } = req.body;
//   try {
//     const crop = await Crop.create({ farmer, name, price, quantity });
//     res.json(crop);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// module.exports = router;
const express = require("express");
const Crop = require("../models/Crop");
const verifyToken = require("../middleware/authMiddleware"); // Protect routes

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
  const { name, price, quantity } = req.body;
  try {
    const crop = await Crop.create({
      farmer: req.user.id, // Assign crop to the logged-in user
      name,
      price,
      quantity,
    });
    res.json(crop);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
