const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  try {
    // 1. Ambil token dari berbagai sumber (header, cookie, body)
    const token =
      req.headers.authorization?.split(" ")[1] || // Mengambil token dari header Authorization
      req.cookies.token || // Mengambil token dari cookie
      req.body.token; // Mengambil token dari body (jika ada)

    if (!token) {
      return res.status(401).json({ message: "No token provided." });
    }

    // 2. Validasi JWT_SECRET
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in environment variables.");
    }

    // 3. Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Validasi payload
    if (!decoded.userId) {
      return res.status(401).json({ message: "Token payload invalid." });
    }

    // 5. Tambahkan user info ke request
    req.user = {
      userId: decoded.userId,
      role: decoded.role, // Jika ada data tambahan
    };

    next(); // Melanjutkan ke middleware atau rute berikutnya
  } catch (error) {
    // Handle error spesifik
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired." });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token." });
    }
    // Log kesalahan untuk debugging
    console.error("Authentication error:", error.message);
    res
      .status(500)
      .json({ message: "Authentication failed.", error: error.message });
  }
};

module.exports = authMiddleware;
