
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User.js");
const isAuthenticated = require("../middleware/auth.js");

//change password api endpoint---------------------------------------------------------------------------------------------------------------------------
router.post("/changePassword",isAuthenticated, async (req, res) => {
  try {
    const user_id = req.body.user_id;
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;

    console.log(user_id, currentPassword, newPassword);

    const user = await User.findOne({ _id:user_id }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ status: "error", error: "Invalid username or password" });
    }

    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ status: "error", error: "Invalid username or password" });
    }

    const hashPassword = await bcrypt.hash(newPassword, 12);

    await User.updateOne(
      { _id: user_id },
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