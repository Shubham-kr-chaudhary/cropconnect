// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");
// const Crop = require("../models/Crop");
// const verifyToken = require("../middleware/authMiddleware"); // Import the correct auth middleware

// // GET /api/user/dashboard
// // Returns user data + user-specific crops
// router.get("/dashboard", verifyToken, async (req, res) => {
//   try {
//     // 1. Fetch user by ID (excluding password)
//     const user = await User.findById(req.user.id).select("-password");
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // 2. Fetch all crops that belong to this user (assuming Crop has `farmer` field)
//     const crops = await Crop.find({ farmer: req.user.id });

//     // 3. Return both user and crops
//     res.json({ user, crops });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Crop = require("../models/Crop");
const verifyToken = require("../middleware/authMiddleware"); // Import the auth middleware

// GET /api/user/dashboard
// Returns user data (excluding password and __v) and user-specific crops
router.get("/dashboard", verifyToken, async (req, res) => {
  try {
    // Fetch user by ID (excluding password and __v)
    const user = await User.findById(req.user.id).select("-password -__v");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch all crops that belong to this user (assuming Crop has a 'farmer' field)
    const crops = await Crop.find({ farmer: req.user.id });
    
    // Log the number of crops found (for debugging)
    console.log(`User ${user._id} has ${crops.length} crops`);

    // Return both user and crops
    res.json({ user, crops });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
