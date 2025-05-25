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
    // Buat ini opsional di registrasi
    pendapatan_bulanan_default: {
      type: Number,
      default: null, // Atau 0, tergantung preferensi Anda untuk nilai default jika belum diisi
    },
    // Buat ini opsional di registrasi
    jumlah_anggota_keluarga_default: {
      type: Number,
      default: null, // Atau 0
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
