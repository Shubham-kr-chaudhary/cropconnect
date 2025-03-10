const mongoose = require("mongoose");

const CropSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: "" },     
  genre: { type: String, default: "" },    
  category: { type: String, default: "" }, 
});

module.exports = mongoose.model("Crop", CropSchema);
