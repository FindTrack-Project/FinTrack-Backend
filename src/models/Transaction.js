// src/models/Transaction.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tanggal_transaksi: {
      type: Date,
      required: true,
    },
    jumlah: {
      type: Number,
      required: true,
    },
    tipe_transaksi: {
      type: String,
      required: true,
      enum: ["Pemasukan", "Pengeluaran", "Transfer"],
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    deskripsi: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indeks untuk query yang sering digunakan
TransactionSchema.index({ user_id: 1, tanggal_transaksi: -1 }); // Untuk mencari transaksi berdasarkan user dan tanggal

module.exports = mongoose.model("Transaction", TransactionSchema);
