// src/models/User.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password_hash: {
      type: String,
      required: true,
    },
    nama_lengkap: {
      type: String,
      required: true,
      trim: true,
    },
    tanggal_registrasi: {
      type: Date,
      default: Date.now,
    },
    pendapatan_bulanan_default: {
      type: Number,
      default: 0,
    },
    jumlah_anggota_keluarga_default: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Menambahkan createdAt dan updatedAt otomatis
  }
);

module.exports = mongoose.model("User", UserSchema);
