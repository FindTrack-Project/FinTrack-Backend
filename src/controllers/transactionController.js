// src/controllers/transactionController.js
const Transaction = require("../models/Transaction");
const Category = require("../models/Category");
const mongoose = require("mongoose");

const transactionController = {
  async createTransaction(req, res) {
    const { tanggalTransaksi, jumlah, tipeTransaksi, categoryId, deskripsi } =
      req.body;
    const userId = req.userId;

    if (!tanggalTransaksi || !jumlah || !tipeTransaksi || !categoryId) {
      return res
        .status(400)
        .json({ message: "Missing required transaction fields." });
    }

    try {
      // Validasi categoryId
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID format." });
      }

      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found." });
      }
      // Pastikan kategori adalah milik pengguna atau global
      if (category.user_id && String(category.user_id) !== String(userId)) {
        return res
          .status(403)
          .json({ message: "Category not accessible by this user." });
      }

      const newTransaction = new Transaction({
        user_id: userId,
        tanggal_transaksi: new Date(tanggalTransaksi), // Pastikan format tanggal benar
        jumlah,
        tipe_transaksi: tipeTransaksi,
        category_id: categoryId,
        deskripsi,
      });
      await newTransaction.save();
      res.status(201).json({
        message: "Transaction created successfully!",
        transaction: newTransaction,
      });
    } catch (error) {
      console.error("Error creating transaction:", error);
      res.status(500).json({ message: "Server error.", error: error.message });
    }
  },

  async getUserTransactions(req, res) {
    const userId = req.userId;
    const { limit = 10, offset = 0 } = req.query;
    try {
      const transactions = await Transaction.find({ user_id: userId })
        .populate("category_id", "nama_kategori tipe_kategori") // Join dengan collection Category
        .sort({ tanggal_transaksi: -1 }) // Urutkan dari yang terbaru
        .skip(parseInt(offset))
        .limit(parseInt(limit));
      res.status(200).json({ transactions });
    } catch (error) {
      console.error("Error fetching user transactions:", error);
      res.status(500).json({ message: "Server error.", error: error.message });
    }
  },

  async getTransactionById(req, res) {
    const { id } = req.params;
    const userId = req.userId;

    try {
      // Validasi ID transaksi
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ message: "Invalid transaction ID format." });
      }

      const transaction = await Transaction.findOne({
        _id: id,
        user_id: userId,
      }).populate("category_id", "nama_kategori tipe_kategori"); // Join kategori
      if (!transaction) {
        return res
          .status(404)
          .json({ message: "Transaction not found or not authorized." });
      }
      res.status(200).json({ transaction });
    } catch (error) {
      console.error("Error fetching transaction by ID:", error);
      res.status(500).json({ message: "Server error.", error: error.message });
    }
  },

  async updateTransaction(req, res) {
    const { id } = req.params;
    const userId = req.userId;
    const { tanggalTransaksi, jumlah, tipeTransaksi, categoryId, deskripsi } =
      req.body;

    if (!tanggalTransaksi || !jumlah || !tipeTransaksi || !categoryId) {
      return res
        .status(400)
        .json({ message: "Missing required transaction fields for update." });
    }

    try {
      // Validasi categoryId
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID format." });
      }
      const category = await Category.findById(categoryId);
      if (
        !category ||
        (category.user_id && String(category.user_id) !== String(userId))
      ) {
        return res
          .status(403)
          .json({ message: "Invalid category ID or category not accessible." });
      }

      const updatedTransaction = await Transaction.findOneAndUpdate(
        { _id: id, user_id: userId },
        {
          tanggal_transaksi: new Date(tanggalTransaksi),
          jumlah,
          tipe_transaksi: tipeTransaksi,
          category_id: categoryId,
          deskripsi,
        },
        { new: true } // Mengembalikan dokumen setelah diupdate
      );

      if (!updatedTransaction) {
        return res.status(404).json({
          message: "Transaction not found or not authorized for update.",
        });
      }
      res.status(200).json({
        message: "Transaction updated successfully!",
        transaction: updatedTransaction,
      });
    } catch (error) {
      console.error("Error updating transaction:", error);
      res.status(500).json({ message: "Server error.", error: error.message });
    }
  },

  async deleteTransaction(req, res) {
    const { id } = req.params;
    const userId = req.userId;

    try {
      // Validasi ID transaksi
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ message: "Invalid transaction ID format." });
      }

      const deletedTransaction = await Transaction.findOneAndDelete({
        _id: id,
        user_id: userId,
      });
      if (!deletedTransaction) {
        return res.status(404).json({
          message: "Transaction not found or not authorized for deletion.",
        });
      }
      res.status(200).json({ message: "Transaction deleted successfully!" });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      res.status(500).json({ message: "Server error.", error: error.message });
    }
  },

  // Fungsi untuk mendapatkan ringkasan bulanan (penting untuk ML)
  async getMonthlySummary(req, res) {
    const userId = req.userId;
    const { year, month } = req.query;

    if (!year || !month) {
      return res
        .status(400)
        .json({ message: "Year and month are required for summary." });
    }

    try {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1); // Bulan di JS 0-indexed
      const endDate = new Date(
        parseInt(year),
        parseInt(month),
        0,
        23,
        59,
        59,
        999
      ); // Akhir bulan

      const summary = await Transaction.aggregate([
        {
          $match: {
            user_id: new mongoose.Types.ObjectId(userId), // Pastikan user_id sesuai ObjectId
            tanggal_transaksi: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: null, // Group semua dokumen yang cocok
            total_pemasukan: {
              $sum: {
                $cond: [
                  { $eq: ["$tipe_transaksi", "Pemasukan"] },
                  "$jumlah",
                  0,
                ],
              },
            },
            total_pengeluaran: {
              $sum: {
                $cond: [
                  { $eq: ["$tipe_transaksi", "Pengeluaran"] },
                  "$jumlah",
                  0,
                ],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            total_pemasukan: 1,
            total_pengeluaran: 1,
          },
        },
      ]);

      // Agregasi terpisah untuk pengeluaran per kategori
      const categorySpending = await Transaction.aggregate([
        {
          $match: {
            user_id: new mongoose.Types.ObjectId(userId),
            tipe_transaksi: "Pengeluaran",
            tanggal_transaksi: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $lookup: {
            // "Join" dengan koleksi kategori
            from: "categories", // Nama koleksi di MongoDB (biasanya plural dari nama model)
            localField: "category_id",
            foreignField: "_id",
            as: "categoryInfo",
          },
        },
        { $unwind: "$categoryInfo" }, // Buka array categoryInfo
        {
          $group: {
            _id: "$category_id",
            nama_kategori: { $first: "$categoryInfo.nama_kategori" },
            total_jumlah: { $sum: "$jumlah" },
          },
        },
        {
          $project: {
            _id: 0,
            category_id: "$_id",
            nama_kategori: 1,
            total_jumlah: 1,
          },
        },
      ]);

      res.status(200).json({
        summary: summary[0] || { total_pemasukan: 0, total_pengeluaran: 0 },
        pengeluaran_per_kategori: categorySpending,
      });
    } catch (error) {
      console.error("Error fetching monthly summary:", error);
      res.status(500).json({ message: "Server error.", error: error.message });
    }
  },

  // Fungsi ini penting untuk model ML Anda (mendapatkan data historis)
  async getHistoricalSpending(req, res) {
    const userId = req.userId;
    const { startDate, endDate } = req.query; // Format YYYY-MM-DD

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "Start date and end date are required for historical data.",
      });
    }

    try {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start) || isNaN(end)) {
        return res.status(400).json({ message: "Invalid date format." });
      }

      const historicalData = await Transaction.aggregate([
        {
          $match: {
            user_id: new mongoose.Types.ObjectId(userId),
            tipe_transaksi: "Pengeluaran",
            tanggal_transaksi: { $gte: start, $lte: end },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$tanggal_transaksi" },
              month: { $month: "$tanggal_transaksi" },
            },
            total_pengeluaran_bulan_ini: { $sum: "$jumlah" },
            // Anda bisa menambahkan agregasi per kategori di sini jika perlu untuk ML
            // pengeluaran_per_kategori: {
            //     $push: {
            //         category_id: '$category_id',
            //         jumlah: '$jumlah'
            //     }
            // }
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
      ]);

      res.status(200).json({ historicalData });
    } catch (error) {
      console.error("Error fetching historical spending:", error);
      res.status(500).json({ message: "Server error.", error: error.message });
    }
  },
};

module.exports = transactionController;
