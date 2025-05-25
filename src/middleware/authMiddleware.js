// src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  // Ambil token dari header Authorization
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied." });
  }

  const token = authHeader.split(" ")[1]; // Ambil token setelah 'Bearer '

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Tambahkan userId dari token ke objek request
    req.userId = decoded.userId;
    next(); // Lanjutkan ke handler route
  } catch (error) {
    res.status(401).json({ message: "Token is not valid." });
  }
};

module.exports = authMiddleware;
