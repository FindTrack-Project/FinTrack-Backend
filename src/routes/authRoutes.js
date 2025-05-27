// Contoh: src/routes/authRoutes.js
const express = require("express");
const router = express.Router();

// Pastikan Anda mendefinisikan route di sini
router.post("/register", (req, res) => {
  //   console.log("Register request hit", req.body);
  res.status(200).json({ message: "Register successful" });
});

router.post("/login", (req, res) => {
  //   console.log("Login  request hit", req.body);
  res.status(200).json({ message: "Login successful" });
});

module.exports = router; // PENTING: Ekspor router ini
