const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name:                     { type: String, required: true },
  email:                    { type: String, unique: true, required: true },
  password:                 { type: String, required: true },
  role:                     { type: String, enum: ["farmer", "firm"], required: true },
  profilePicture:           { type: String },                         // Optional
  solanaPubkey:             { type: String, required: true, unique: true },
  // (Optionally, if you want to tie on-chain IDs to your DB record)
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
