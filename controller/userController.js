const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const User = require("../models/User.js");


router.post("/register", async (req, res, next) => {
  //data from frontend
  const { username, email, password, phoneNumber } = req.body; //destructuring

  if (!username || typeof username !== "string") {
    return res.json({ status: "error", error: "Invalid username" });
  }

  if (!email || typeof email !== "string") {
    return res.json({ status: "error", error: "Invalid email" });
  }

  try {
    // password encryption for security
    const hashPassword = await bcrypt.hash(password, 12);

    const response = await User.create({
      username,
      email,
      password: hashPassword,
      phoneNumber,
    });
    console.log("User created successfully: ", response);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ status: "error", error: "Username already in use" });
    }
    throw error;
  }
  res.json({ status: "ok" });
});

router.post("/sign", async (req, res) => {
  
  const { username, password } = req.body;
  console.log(req.body);
  const user = await User.findOne({ username }).select('+password');
  console.log(user);

  if (!user) {
    return res.status(401).json({ status: "error", error: "Invalid username or password" });
  }

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET
    );
    return res.json({ status: "ok", data: token });
  }else{
    return res.json({ status: "error", error: "Invalid username or password" });
  }
});

module.exports = router;
