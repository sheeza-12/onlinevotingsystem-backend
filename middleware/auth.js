// backend/middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const header = req.headers.authorization || req.query.token;
  if (!header) return res.status(401).json({ message: "No token provided" });

  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : header;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
};
