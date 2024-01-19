const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User.js");
const isAuthenticated = require("../middleware/auth.js");

//change password api endpoint---------------------------------------------------------------------------------------------------------------------------
router.post("/changePassword", isAuthenticated, async (req, res) => {
  try {
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;

    const data = await User.findById(req.user.id).select("+password");

    if (!data) {
      return res
        .status(401)
        .json({ status: "error", error: "Invalid password" });
    }

    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      data.password
    );

    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ status: "error", error: "Invalid username or password" });
    }

    const hashPassword = await bcrypt.hash(newPassword, 12);

    await User.updateOne(
      { _id: req.user.id },
      {
        $set: {
          password: hashPassword,
        },
      }
    );

    res.json({ status: "ok" });
  } catch (error) {
    res.status(400).json({ status: "error", error: "Server error" });
    console.log(error);
  }
});

module.exports = router;
