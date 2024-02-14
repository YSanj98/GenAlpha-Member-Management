const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("../models/User.js");
const isAuthenticated = require("../middleware/auth.js");

//change password api endpoint---------------------------------------------------------------------------------------------------------------------------
router.post("/changePassword", isAuthenticated, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const data = await User.findById(req.user.id).select("+password");

    if (!data) {
      return res
        .status(404)
        .json({ status: "error", error: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(currentPassword, data.password);

    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ status: "error", error: "Invalid  password" });
    }

    const hashPassword = await bcrypt.hash(newPassword, 12);

    await User.updateOne({ _id: req.user.id }, { password: hashPassword });

    res.status(200).json({
      status: "ok",
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(400).json({ status: "error", error: "Server error" });
  }
});

//account delete api endpoint---------------------------------------------------------------------------------------------------------------------------
router.post("/deleteAccount", isAuthenticated, async (req, res) => {
  try {
    const password = req.body.password;

    const data = await User.findById(req.user.id).select("+password");

    if (!data) {
      return res
        .status(404)
        .json({ status: "error", error: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, data.password);

    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ status: "error", error: "Invalid  password" });
    }

    await User.deleteOne({ _id: req.user.id });
    
    res.status(200).json({
      status: "ok",
      message: "Account deleted successfully",
    });
  
  } catch (error) {
    res.status(400).json({ status: "error", error: "Server error" });
  }
});

module.exports = router;
