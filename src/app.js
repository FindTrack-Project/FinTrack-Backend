// src/app.js
const express = require("express");
const cors = require("cors"); // Import cors
const app = express(); // <<< Pastikan baris ini ada dan tidak ada yang menimpanya

// Middleware
app.use(express.json()); // Untuk parse body JSON dari permintaan
app.use(cors()); // Gunakan cors middleware

// Import Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

// Gunakan Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Welcome to FinTrack Backend API!");
});

// Error handling middleware (opsional, tapi direkomendasikan)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Ini penting: export instance aplikasi Express
module.exports = app;
