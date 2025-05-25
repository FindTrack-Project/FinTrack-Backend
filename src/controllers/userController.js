// src/controllers/userController.js
const User = require("../models/User");

const userController = {
  async getUserProfile(req, res) {
    const userId = req.userId; // Dari middleware autentikasi (berupa ObjectId)
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
};

module.exports = userController;
