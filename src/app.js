// src/app.js
const express = require("express");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "fintrack-backend-production-3a26.up.railway.app", // Ganti dengan domain frontend Anda
    methods: ["GET", "POST", "PUT", "DELETE"], // Metode yang diizinkan
    credentials: true, // Jika Anda perlu mengizinkan cookies
  })
);
// ======================
// 1. Middleware Standar
// ======================
app.use(express.json()); // Parsing body JSON

// ======================
// 2. Import Routes
// ======================
// Pastikan nama file route sesuai!
const authRoutes = require("./routes/authRoutes"); // Contoh: authRoute.js
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

// ======================
// 3. Gunakan Routes
// ======================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);

// ======================
// 4. Route Pengujian (Debugging)
// ======================
app.get("/api/", (req, res) => {
  res.json({ message: "API is working!", timestamp: new Date().toISOString() });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "API test endpoint works!" });
});

app.post("/test-direct-post", (req, res) => {
  res.json({ message: "Direct POST route works!", yourData: req.body });
});

// ======================
// 5. Error Handling
// ======================
app.use((err, req, res, next) => {
  console.error("Error:", err.stack || err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

// ======================
// 6. Daftar Endpoint (Debugging)
// ======================
if (process.env.NODE_ENV !== "production") {
  const listEndpoints = require("express-list-endpoints");
  console.log("\n--- Daftar Endpoint ---");
  console.log(listEndpoints(app));
  console.log("-----------------------\n");
}

// ======================
// 7. Export App
// ======================
module.exports = app;
