
const jwt  = require("jsonwebtoken");
const User = require("../models/User");

async function verifyToken(req, res, next) {
  const header = req.header("Authorization");
  if (!header) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  const token = header.replace("Bearer ", "").trim();
  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  try {
    // 1) Verify & decode
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2) Look up the full user record
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "User no longer exists" });
    }

    // 3) Attach the bits we need downstream
    req.user = {
      id:           user._id.toString(),
      role:         user.role,
      solanaPubkey: user.solanaPubkey,
    };

    next();
  } catch (err) {
    console.error("AuthMiddleware error:", err);
    return res.status(401).json({ error: "Token is not valid" });
  }
}

module.exports = verifyToken;
