const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMails = require("../utils/sendMails.js");
const crypto = require("crypto");

const User = require("../models/User.js");
const isAuthenticated= require("../middleware/auth.js");
const generateOTP = require("../utils/generateOTP.js");

const otpStore = {};

//user register api endpoint---------------------------------------------------------------------------------------------------------------------------
router.post("/register", async (req, res) => {
  const { firstName, lastName, username, email, password, phoneNumber, confirmPassword } = req.body;

  if (!email || typeof email !== "string") {
    return res.json({ status: "error", error: "Email empty or invalid" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.json({ status: "error", error: "Invalid email format" });
  }

    // Password validation using regex
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.json({
        status: "error",
        error: "Invalid password format"
      });
    }

  // Check if password and confirmPassword are the same
  if (password !== confirmPassword) {
    return res.json({ status: "error", error: "Passwords do not match" });
  }

  try {
    // Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.json({ status: "error", error: "Email or username already registered" });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const response = await User.create({
      username,
      firstName,
      lastName,
      email,
      password: hashPassword,
      phoneNumber,
    });
    res.json({ status: "ok", message: "User created successfully" });
  } catch (error) {
    throw error;
  }
});

//user login api endpoint---------------------------------------------------------------------------------------------------------------------------
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne(
    { $or: [{ email: username }, { username: username }] }
  ).select("+password");

  if (!user) {
    return res
      .json({ status: "error" , error: "User Not Found" });
  }else if (user && await bcrypt.compare(password, user.password)) {
    //compare password with hashed password
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,

    );
    return res.json({ status: "ok", token: token });
  } else {
    return res.json({ status: "error", error: "Invalid password" });
  }
});

//forgot password api endpoint---------------------------------------------------------------------------------------------------------------------------
router.post("/forgotPassword", async (req, res) => {
  const userIdentifier = req.body.email 
  
  const user = await User.findOne({email:userIdentifier}); //find user by email or phone number

  if (!user) {
    return res.status(400).json({ status: "error", error: "Invalid username" });
  }

  const otp = generateOTP(); //generate otp using otp-generator. configs are in utils/generateOTP.js
  otpStore[userIdentifier] = {
    otp, expireAt: Date.now() +  60*2000,
    email: user.email
  };

  //send email to user and provide link to reset password. forgot passwprd means user need to reset the password
  const emailBody = `Hi ${user.firstName}, 
  Your OTP is ${otp}`;

  try {
    await sendMails({
      //send email to user using nodemailer. configs are in utils/sendMails.js
      email: user.email,
      subject: "GAP password reset",
      message: emailBody,
    });
    res.status(201).json({
      success: true,
      message: `Check ${user.email} and use the OTP to reset your password`,
    });
  } catch (error) {
    return res.status(400).json({ status: "Failed", error: error.message });
  }
});

//reset password api endpoint---------------------------------------------------------------------------------------------------------------------------
router.post("/resetPassword", async (req, res) => {
  const { otp, password } = req.body;

  // Verify OTP
  const storedOTP = Object.values(otpStore).find((stored) => stored.otp === otp);

  if (storedOTP && storedOTP.expireAt > Date.now()) {
    try {
      // Find user by email
      const user = await User.findOne({ email: storedOTP.email });

      if (!user) {
        return res.status(400).json({ status: "Failed", message: "User not found" });
      }

      // Hash the new password
      const hashPassword = await bcrypt.hash(password, 12);

      // Update user password
      user.password = hashPassword;

      // Save the user
      await user.save();

      // Send success response
      return res.status(200).json({
        status: "success",
        message: "Password reset successfully",
      });
    } catch (error) {
      return res.status(500).json({ status: "Failed", message: "Internal Server Error", error: error.message });
    }
  } else {
    // Invalid OTP
    return res.status(400).json({
      status: "Failed",
      message: "Invalid OTP",
    });
  }
});

module.exports = router;
