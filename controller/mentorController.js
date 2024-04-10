const express = require("express");
const router = express.Router();
const sendMails = require("../utils/sendMails.js");
const isAuthenticated = require("../middleware/auth.js");
const User = require("../models/User.js");

router.post("/applyMentor", isAuthenticated, async (req, res) => {
  const { yearsOfExp, expertise, tools, skills, introduction } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    return res.json({ status: "error", error: "Invalid user" });
  }

  const emailBody = `
  This is the Mentor Application of ${user.firstName} ${user.lastName}. 

  Years of Experience: ${yearsOfExp} 
  Expertise: ${expertise} 
  Tools: ${tools} 
  Skills: ${skills} 
  Introduction: ${introduction} 

  click below link to approve or reject the application;

  ${process.env.CLIENT_URL}/applyMentorReview/${user._id}
  `;

  try {
    await sendMails({
      //send email to user using nodemailer. configs are in utils/sendMails.js
      email: process.env.ADMIN_EMAIL,
      subject: `GAP Mentor Application of ${user.firstName} ${user.lastName}`,
      message: emailBody,
    });
    res.status(201).json({
      success: true,
      message: `Check email of admin to review mentor application of ${user.firstName} ${user.lastName}`,
    });
  } catch (error) {
    return res.json({ status: "Failed", error: error.message });
  }
});

module.exports = router;
