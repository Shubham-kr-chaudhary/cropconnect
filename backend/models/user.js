
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["farmer", "firm"] },
  profilePicture: String, // Optional field for storing image URLs
});

module.exports = mongoose.model("User", UserSchema);
