// src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Gunakan middleware untuk melindungi route ini
router.get("/profile", authMiddleware, userController.getUserProfile);

module.exports = router;
