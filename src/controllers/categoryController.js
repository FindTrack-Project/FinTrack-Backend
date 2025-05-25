// src/controllers/categoryController.js
const Category = require("../models/Category");

const categoryController = {
  async createCategory(req, res) {
    const { namaKategori, tipeKategori } = req.body;
    const userId = req.userId; // Dari middleware autentikasi, bisa null jika kategori global

    // Validasi dasar
    if (!namaKategori || !tipeKategori) {
      return res
        .status(400)
        .json({ message: "Nama kategori dan tipe kategori diperlukan." });
    }
    if (!["Pemasukan", "Pengeluaran"].includes(tipeKategori)) {
      return res.status(400).json({
        message:
          'Tipe kategori tidak valid. Harus "Pemasukan" atau "Pengeluaran".',
      });
    }

    try {
      // Coba buat kategori baru
      const newCategory = new Category({
        nama_kategori: namaKategori,
        tipe_kategori: tipeKategori,
        user_id: userId, // Jika user_id null, Mongoose akan menyimpannya sebagai null
      });
      await newCategory.save();
      res.status(201).json({
        message: "Category created successfully!",
        category: newCategory,
      });
    } catch (error) {
      // Handle duplicate key error (jika kategori sudah ada untuk user tersebut/global)
      if (error.code === 11000) {
        // Kode error MongoDB untuk duplicate key
        return res.status(409).json({
          message:
            "Category with this name already exists for this user or globally.",
        });
      }
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Server error.", error: error.message });
    }
  },

  async getUserCategories(req, res) {
    const userId = req.userId;
    try {
      // Temukan kategori milik user atau kategori global (user_id is null)
      const categories = await Category.find({
        $or: [{ user_id: userId }, { user_id: null }],
      }).sort({ tipe_kategori: 1, nama_kategori: 1 }); // Urutkan
      res.status(200).json({ categories });
    } catch (error) {
      console.error("Error fetching user categories:", error);
      res.status(500).json({ message: "Server error.", error: error.message });
    }
  },
};

module.exports = categoryController;
