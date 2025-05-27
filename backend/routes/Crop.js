
const express     = require("express");
const router      = express.Router();
const Crop        = require("../models/Crop");
const verifyToken = require("../middleware/authMiddleware");
const { PublicKey } = require("@solana/web3.js");

// Load your program ID so you can derive a PDA if needed:
const PROGRAM_ID = new PublicKey(process.env.SOLANA_PROGRAM_ID);

router.get("/", async (req, res) => {
  try {
    const crops = await Crop.find().populate("farmer", "name");
    res.json(crops);
  } catch (error) {
    console.error("Error fetching crops:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/", verifyToken, async (req, res) => {
  console.log("POST /api/crops body:", req.body);
  console.log("Authenticated user:", req.user);

  // 1) Ensure we have the user’s Solana pubkey
  const farmerPubkeyStr = req.user.solanaPubkey;
  if (!farmerPubkeyStr) {
    return res.status(401).json({ error: "User missing Solana public key" });
  }

  const { name, price, quantity, unit, genre, category } = req.body;
  try {
    // 2) Generate your contractId seed
    const contractId = Math.floor(Math.random() * 1_000_000).toString();

    // 3) (Optional) Derive the on-chain PDA
    const farmerPubkey = new PublicKey(farmerPubkeyStr);
    const [pda] = await PublicKey.findProgramAddress(
      [Buffer.from("crop"), farmerPubkey.toBuffer(), Buffer.from(contractId)],
      PROGRAM_ID
    );

    // 4) Persist the Crop **including farmerPubkey**
    const newCrop = await Crop.create({
      contractId,
      pda:          pda.toBase58(),  // optional
      farmer:       req.user.id,
      farmerPubkey: farmerPubkeyStr, // <-- THIS LINE
      name,
      price,
      quantity,
      unit,
      genre,
      category,
    });

    console.log("New crop created in DB:", newCrop);
    return res.json(newCrop);
  } catch (error) {
    console.error("Error creating crop:", error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
