// src/routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, categoryController.createCategory);
router.get("/", authMiddleware, categoryController.getUserCategories);

module.exports = router;
