const mongoose = require("mongoose");

const CropSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  price: Number,
  quantity: Number,
  status: { type: String, default: "available" },
});

module.exports = mongoose.model("Crop", CropSchema);
