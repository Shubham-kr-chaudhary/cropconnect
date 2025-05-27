// const express = require("express");
// const crypto  = require("crypto");
// const Order   = require("../models/Order");
// const Crop    = require("../models/Crop");
// const verify  = require("../middleware/authMiddleware");
// const { logTransactionOnChain } = require("../services/solanaLogger");

// const router = express.Router();

// /**
//  * 1️⃣ Create a pending order (step 1 of Razorpay flow)
//  * POST /api/orders
//  */
// router.post("/", verify, async (req, res) => {
//   try {
//     if (req.user.role !== "firm") {
//       return res.status(403).json({ error: "Only firms can create orders." });
//     }

//     const { cropId, quantity } = req.body;
//     if (!cropId || !quantity) {
//       return res.status(400).json({ error: "cropId & quantity required" });
//     }

//     const crop = await Crop.findById(cropId);
//     if (!crop) {
//       return res.status(404).json({ error: "Crop not found." });
//     }

//     const totalPrice = crop.price * quantity;
//     // create in Mongo as "Pending"
//     const order = await Order.create({
//       buyer:      req.user.id,
//       crop:       crop._id,
//       quantity,
//       totalPrice,
//       status:     "Pending",
//     });

//     // return IDs and amounts so the frontend can launch Razorpay
//     return res.json({
//       mongoOrderId: order._id.toString(),
//       amount:       totalPrice * 100, // in paise
//       currency:     "INR",
//     });
//   } catch (err) {
//     console.error("Create‐order error:", err);
//     return res.status(500).json({ error: "Server error creating order" });
//   }
// });

// /**
//  * 2️⃣ Confirm payment & do on‐chain log
//  * POST /api/orders/confirm
//  */
// router.post("/confirm", verify, async (req, res) => {
//   try {
//     if (req.user.role !== "firm") {
//       return res.status(403).json({ error: "Only firms can confirm." });
//     }

//     const {
//       mongoOrderId,
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//     } = req.body;

//     if (
//       !mongoOrderId ||
//       !razorpay_order_id ||
//       !razorpay_payment_id ||
//       !razorpay_signature
//     ) {
//       return res.status(400).json({ error: "Missing data" });
//     }

//     // load & check
//     const order = await Order.findById(mongoOrderId).populate("crop");
//     if (!order) {
//       return res.status(404).json({ error: "Order not found." });
//     }
//     if (order.status !== "Pending") {
//       return res.status(400).json({ error: "Already processed." });
//     }

//     // verify Razorpay signature
//     const generated = crypto
//       .createHmac("sha256", process.env.RZP_KEY_SECRET)
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest("hex");
//     if (generated !== razorpay_signature) {
//       return res.status(400).json({ error: "Invalid signature" });
//     }

//     // mark Paid
//     order.status = "Paid";
//     order.razorpay = {
//       order_id:   razorpay_order_id,
//       payment_id: razorpay_payment_id,
//       signature:  razorpay_signature,
//     };
//     await order.save();

//     // log on Solana
//     const txSig = await logTransactionOnChain({
//       cropName:       order.crop.name,
//       farmerPubkey: order.crop.farmerPubkey,
//       buyerPubkey:   req.user.solanaPubkey,
//       quantity:     order.quantity,
//       amount:       order.totalPrice,
//     });

//     // save the signature
//     order.txSig = txSig;
//     await order.save();

//     return res.json({ txSig });
//   } catch (err) {
//     console.error("Confirm‐order error:", err);
//     return res.status(500).json({ error: "Server error confirming payment" });
//   }
// });

// /**
//  * 3️⃣ List all orders for this firm
//  * GET /api/orders
//  */
// router.get("/", verify, async (req, res) => {
//   try {
//     if (req.user.role !== "firm") {
//       return res.json([]);
//     }
//     const orders = await Order.find({ buyer: req.user.id })
//       .populate("crop", "name price unit")
//       .sort({ createdAt: -1 });

//     // return full order objects
//     return res.json(orders);
//   } catch (err) {
//     console.error("Fetch orders error:", err);
//     return res.status(500).json({ error: "Server error fetching orders" });
//   }
// });

// module.exports = router;


// backend/routes/order.js
const express = require("express");
const crypto  = require("crypto");
const Order   = require("../models/Order");
const Crop    = require("../models/Crop");
const verify  = require("../middleware/authMiddleware");
const { logTransactionOnChain } = require("../services/solanaLogger");

const router = express.Router();

// 1️⃣ Create a pending order (Razorpay step 1)
router.post("/", verify, async (req, res) => {
  if (req.user.role !== "firm")
    return res.status(403).json({ error: "Only firms can create orders." });

  const { cropId, quantity } = req.body;
  if (!cropId || !quantity)
    return res.status(400).json({ error: "cropId & quantity required" });

  const crop = await Crop.findById(cropId);
  if (!crop) return res.status(404).json({ error: "Crop not found." });

  const totalPrice = crop.price * quantity;
  const order = await Order.create({
    buyer:      req.user.id,
    crop:       crop._id,
    quantity,
    totalPrice,
    status:     "Pending",
  });

  res.json({
    mongoOrderId: order._id.toString(),
    amount:       totalPrice * 100, // paise
    currency:     "INR",
  });
});

// 2️⃣ Confirm payment & “on-chain” log (Razorpay step 2)
router.post("/confirm", verify, async (req, res) => {
  if (req.user.role !== "firm")
    return res.status(403).json({ error: "Only firms can confirm." });

  const {
    mongoOrderId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;
  if (
    !mongoOrderId ||
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature
  ) {
    return res.status(400).json({ error: "Missing payment data." });
  }

  const order = await Order.findById(mongoOrderId).populate("crop");
  if (!order) return res.status(404).json({ error: "Order not found." });
  if (order.status !== "Pending")
    return res.status(400).json({ error: "Already processed." });

  // verify Razorpay signature
  const generated = crypto
    .createHmac("sha256", process.env.RZP_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");
  if (generated !== razorpay_signature)
    return res.status(400).json({ error: "Invalid signature" });

  order.status = "Paid";
  order.razorpay = {
    order_id:   razorpay_order_id,
    payment_id: razorpay_payment_id,
    signature:  razorpay_signature,
  };
  await order.save();

  // stubbed on-chain log
  const txSig = await logTransactionOnChain({
    cropName:     order.crop.name,         // you can pass name or ID; stub ignores it
    quantity:     order.quantity,
    buyerPubkey:  req.user.solanaPubkey,
  });

  order.txSig = txSig;
  await order.save();

  res.json({ txSig });
});

// 3️⃣ List orders
router.get("/", verify, async (req, res) => {
  if (req.user.role !== "firm") return res.json([]);
  const list = await Order.find({ buyer: req.user.id })
    .populate("crop", "name price unit")
    .sort({ createdAt: -1 });
  res.json(list);
});

module.exports = router;

