// src/models/Category.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    nama_kategori: {
      type: String,
      required: true,
      trim: true,
    },
    tipe_kategori: {
      type: String,
      required: true,
      enum: ["Pemasukan", "Pengeluaran"],
    },
    user_id: {
      type: Schema.Types.ObjectId, // Tipe data ObjectId untuk Foreign Key
      ref: "User", // Referensi ke model User
      default: null, // Bisa null untuk kategori global
    },
  },
  {
    timestamps: true,
  }
);

// Indeks unik gabungan untuk mencegah duplikat kategori per user
CategorySchema.index(
  { user_id: 1, nama_kategori: 1 },
  {
    unique: true,
    partialFilterExpression: { user_id: { $exists: true, $ne: null } },
  }
);
CategorySchema.index(
  { nama_kategori: 1 },
  { unique: true, partialFilterExpression: { user_id: { $exists: false } } }
);

module.exports = mongoose.model("Category", CategorySchema);
