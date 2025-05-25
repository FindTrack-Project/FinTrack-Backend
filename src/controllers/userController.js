// src/controllers/userController.js
const User = require("../models/User");

const userController = {
  async getUserProfile(req, res) {
    const userId = req.userId;
    try {
      const user = await User.findById(userId).select("-password_hash");
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      res.status(200).json({ user });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Server error.", error: error.message });
    }
  },

  async updateProfile(req, res) {
    const userId = req.userId;
    // Hanya izinkan update field tertentu
    const {
      namaLengkap,
      pendapatanBulananDefault,
      jumlahAnggotaKeluargaDefault,
    } = req.body;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Update hanya jika field diberikan di body
      if (namaLengkap !== undefined) user.nama_lengkap = namaLengkap;
      if (pendapatanBulananDefault !== undefined)
        user.pendapatan_bulanan_default = pendapatanBulananDefault;
      if (jumlahAnggotaKeluargaDefault !== undefined)
        user.jumlah_anggota_keluarga_default = jumlahAnggotaKeluargaDefault;

      await user.save(); // Simpan perubahan

      // Kirim respons tanpa password_hash
      const updatedUser = user.toObject(); // Konversi ke objek JS biasa
      delete updatedUser.password_hash;

      res
        .status(200)
        .json({ message: "Profile updated successfully!", user: updatedUser });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Server error.", error: error.message });
    }
  },
};

module.exports = userController;
