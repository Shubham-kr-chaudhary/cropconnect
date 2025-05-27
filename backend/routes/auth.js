const express  = require("express");
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const { Keypair } = require("@solana/web3.js");
const User     = require("../models/User");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    // 1) Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2) Generate a new Solana keypair for this user
    const keypair       = Keypair.generate();
    const solanaPubkey  = keypair.publicKey.toBase58();
    // (Optionally persist keypair.secretKey somewhere secure)

    // 3) Create user with solanaPubkey
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      solanaPubkey,
    });

    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({ error: error.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1) Find & verify user
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // 2) Sign JWT including solanaPubkey
    const payload = {
      id:          user._id,
      role:        user.role,
      solanaPubkey: user.solanaPubkey,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, role: user.role });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Example Protected Route
router.get("/protected", verifyToken, async (req, res) => {
  res.json({ message: "You are authorized!", user: req.user });
});

module.exports = router;
