const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  buyer:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  crop:       { type: mongoose.Schema.Types.ObjectId, ref: "Crop", required: true },
  quantity:   { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status:     { type: String, default: "Pending" },
  razorpay: {
    order_id:   String,
    payment_id: String,
    signature:  String
  },
  txSig:      String,
  createdAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);
