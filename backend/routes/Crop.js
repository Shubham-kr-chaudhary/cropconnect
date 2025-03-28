// const express = require("express");
// const router = express.Router();
// const Crop = require("../models/Crop");
// const verifyToken = require("../middleware/authMiddleware");

// // GET /api/crops (Public)
// router.get("/", async (req, res) => {
//   try {
//     const crops = await Crop.find().populate("farmer", "name");
//     res.json(crops);
//   } catch (error) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // POST /api/crops (Protected) - Generates a random ID for 'contractId'
// router.post("/", verifyToken, async (req, res) => {
//   const { name, price, quantity, unit, genre, category } = req.body;

//   try {
//     // Generate a random integer for the "contractId"
//     // (You can use any approach you want here, e.g. UUID, shortid, etc.)
//     const randomId = Math.floor(Math.random() * 1_000_000);

//     // Create the crop in Mongo
//     const newCrop = await Crop.create({
//       contractId: randomId.toString(), // convert to string if you prefer
//       farmer: req.user.id,
//       name,
//       price,
//       quantity,
//       unit,
//       genre,
//       category,
//     });

//     res.json(newCrop);
//   } catch (error) {
//     console.error("Error creating crop:", error);
//     res.status(400).json({ error: error.message });
//   }
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const Crop = require("../models/Crop");
const verifyToken = require("../middleware/authMiddleware");
const { ethers } = require("ethers");

// GET /api/crops (Public)
router.get("/", async (req, res) => {
  try {
    console.log("GET /api/crops called");
    const crops = await Crop.find().populate("farmer", "name");
    res.json(crops);
  } catch (error) {
    console.error("Error fetching crops:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/crops (Protected) - Generates a random ID for 'contractId'
router.post("/", verifyToken, async (req, res) => {
  console.log("POST /api/crops called with body:", req.body);

  // Check that verifyToken set req.user correctly
  if (!req.user || !req.user.id) {
    console.error("User not found in token");
    return res.status(401).json({ error: "User not authenticated" });
  }
  console.log("User from token:", req.user.id);

  const { name, price, quantity, unit, genre, category } = req.body;
  try {
    // Generate a random integer for the "contractId"
    const randomId = Math.floor(Math.random() * 1_000_000);
    console.log("Generated random contractId:", randomId.toString());

    // Create the crop in Mongo with the random contractId
    const newCrop = await Crop.create({
      contractId: randomId.toString(),
      farmer: req.user.id,
      name,
      price,
      quantity,
      unit,
      genre,
      category,
    });
    console.log("New crop created in DB:", newCrop);
    res.json(newCrop);
  } catch (error) {
    console.error("Error creating crop:", error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
