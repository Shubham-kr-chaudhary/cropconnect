// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");
// const Crop = require("../modelscrop");
// const auth = require("../middleware/auth"); // Your JWT auth middleware

// // GET /api/user/dashboard
// // Returns user data + user-specific crops
// router.get("/dashboard", auth, async (req, res) => {
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
const verifyToken = require("../middleware/authMiddleware"); // Import the correct auth middleware

// GET /api/user/dashboard
// Returns user data + user-specific crops
router.get("/dashboard", verifyToken, async (req, res) => {
  try {
    // 1. Fetch user by ID (excluding password)
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 2. Fetch all crops that belong to this user (assuming Crop has `farmer` field)
    const crops = await Crop.find({ farmer: req.user.id });

    // 3. Return both user and crops
    res.json({ user, crops });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
