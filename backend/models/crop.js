const mongoose = require("mongoose");

const CropSchema = new mongoose.Schema({
  contractId: { type: String }, 
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  price: Number,
  quantity: Number,
  unit: String,
  genre: String,
  category: String,
});

module.exports = mongoose.model("Crop", CropSchema);
