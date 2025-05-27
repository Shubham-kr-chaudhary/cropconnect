// backend/scripts/backfillFarmerPubkey.js
require("dotenv").config();
const mongoose = require("mongoose");
const Crop     = require("../models/Crop");
const User     = require("../models/User");

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB, starting backfill…");

  const all = await Crop.find();
  for (let c of all) {
    if (!c.farmerPubkey) {
      const farmer = await User.findById(c.farmer);
      if (farmer && farmer.solanaPubkey) {
        c.farmerPubkey = farmer.solanaPubkey;
        await c.save();
        console.log("Backfilled crop", c._id);
      }
    }
  }

  console.log("Done backfilling.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
