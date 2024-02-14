const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("../models/User.js");
const isAuthenticated = require("../middleware/auth.js");

//get user count api endpoint---------------------------------------------------------------------------------------------------------------------------
router.get("/members", async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({ status: "ok", members: userCount });
  } catch (error) {
    res.status(400).json({ status: "error", error: "Server error" });

  }
});

module.exports = router;
