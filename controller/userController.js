const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User.js");

router.post("/register", async (req, res, next) => {
  //data from frontend
  const { firstName, lastName, username, email, password, phoneNumber } = req.body; //destructuring

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
      firstName,
      lastName,
      email,
      password: hashPassword,
      phoneNumber,
    });
    console.log("User created successfully: ", response);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ status: "error", error: "Username already in use" });
    }
    throw error;
  }
  res.json({ status: "ok" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  const user = await User.findOne({ username }).select("+password");
  console.log(user);

  if (!user) {
    return res
      .status(401)
      .json({ status: "error", error: "Invalid username or password" });
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
  } else {
    return res.json({ status: "error", error: "Invalid username or password" });
  }
});

router.post("/forgot-password", async (req, res) => {
  const { token, newPassword } = req.body;
  console.log(req.body);

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decodedToken;

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update the user's password in the database
    await User.findByIdAndUpdate(id, { $set: { password: hashedPassword } });

    res.json({ status: "ok" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: "error", error: "Invalid or expired token" });
  }
});


module.exports = router;
