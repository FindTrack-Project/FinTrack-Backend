// src/controllers/authController.js
const User = require("../models/User"); // Import model User
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authController = {
  async register(req, res) {
    const {
      email,
      password,
      namaLengkap,
      pendapatanBulananDefault,
      jumlahAnggotaKeluargaDefault,
    } = req.body;
    try {
      const existingUser = await User.findOne({ email }); // Menggunakan Mongoose findOne
      if (existingUser) {
        return res.status(409).json({ message: "Email already registered." });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = new User({
        // Membuat instance model User
        email,
        password_hash: passwordHash,
        nama_lengkap: namaLengkap,
        pendapatan_bulanan_default: pendapatanBulananDefault,
        jumlah_anggota_keluarga_default: jumlahAnggotaKeluargaDefault,
      });
      await newUser.save(); // Menyimpan user baru ke database

      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(201).json({
        message: "User registered successfully!",
        token,
        user: {
          id: newUser._id,
          email: newUser.email,
          namaLengkap: newUser.nama_lengkap,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        message: "Server error during registration.",
        error: error.message,
      });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials." });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials." });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(200).json({
        message: "Logged in successfully!",
        token,
        user: {
          id: user._id,
          email: user.email,
          namaLengkap: user.nama_lengkap,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res
        .status(500)
        .json({ message: "Server error during login.", error: error.message });
    }
  },
};

module.exports = authController;
