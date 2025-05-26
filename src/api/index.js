// src/server.js
const app = require("../app");
const connectDB = require("../config/mongoose"); // Import koneksi MongoDB
require("dotenv").config();

const PORT = process.env.PORT || 3000;

// Panggil fungsi untuk menghubungkan ke database sebelum menjalankan server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

module.exports = app;
