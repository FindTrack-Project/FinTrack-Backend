// src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/profile", authMiddleware, userController.getUserProfile);
// Tambahkan route untuk update profile
router.put("/profile", authMiddleware, userController.updateProfile);

module.exports = router;
