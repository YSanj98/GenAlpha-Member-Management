const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

router.post("/register", async (req, res, next) => {

  //data from frontend
  let { username, email, password, phoneNumber } = req.body; //destructuring

  if (!username || typeof username !== "string") {
    return res.json({ status: "error", error: "Invalid username" });
  }

  if (!email || typeof email !== "string") {
    return res.json({ status: "error", error: "Invalid email" });
  }

  //password encryption for security
  bcrypt.hash(password, 12, function (err, hashPassword) {
    if (err) {
      return res.json({ status: "error", error: "Invalid password" });
    }
    password = hashPassword;
  });

  try {
    let response = await User.create({
      username,
      email,
      password,
      phoneNumber,
    });
    console.log("User created successfully: ", response);
  } catch (error) {
    if (error.code === 11000) {
      return res.json({ status: "error", error: "Username already in use" });
    }
    throw error;
  }
  res.json({ status: "ok" });
});

module.exports = router;
