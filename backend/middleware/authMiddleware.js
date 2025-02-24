const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const header = req.header("Authorization");
  if (!header) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  // Extract token from "Bearer <token>"
  const token = header.replace("Bearer ", "").trim();
  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role }; // Attach user details to req
    next(); // Proceed to next middleware/route
  } catch (err) {
    console.error("Invalid token:", err);
    return res.status(401).json({ error: "Token is not valid" });
  }
};

module.exports = verifyToken;
