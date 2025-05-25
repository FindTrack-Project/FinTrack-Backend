// src/routes/transactionRoutes.js
const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const authMiddleware = require("../middleware/authMiddleware");

// Semua route transaksi akan dilindungi dengan authMiddleware
router.post("/", authMiddleware, transactionController.createTransaction);
router.get("/", authMiddleware, transactionController.getUserTransactions);
router.get("/summary", authMiddleware, transactionController.getMonthlySummary); // Endpoint baru untuk ringkasan bulanan
router.get(
  "/historical",
  authMiddleware,
  transactionController.getHistoricalSpending
); // Endpoint untuk data historis ML

router.get("/:id", authMiddleware, transactionController.getTransactionById);
router.put("/:id", authMiddleware, transactionController.updateTransaction);
router.delete("/:id", authMiddleware, transactionController.deleteTransaction);

module.exports = router;
