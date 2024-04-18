const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("../models/User.js");

//get user count api endpoint---------------------------------------------------------------------------------------------------------------------------
router.get("/members", async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    return res.json({ status: "ok", members: userCount });
  } catch (error) {
    return res.json({ status: "error", error: error });

  }
});

module.exports = router;
