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

router.get("/mentors", async (req, res) => {
  try {
    const mentors = await User.find({ isMentor: true });
    const countMentors = await User.countDocuments({ isMentor: true });

    if (!mentors) {
      return res.json({ status: "error", error: "No mentors found" });
    } else {
      return res.json({ status: "ok", mentors: countMentors });
    }
  } catch (error) {
    return res.json({ status: "error", error: error });
  }
});

module.exports = router;
