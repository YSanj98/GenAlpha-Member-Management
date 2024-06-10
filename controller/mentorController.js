const express = require("express");
const router = express.Router();
const sendMails = require("../utils/sendMails.js");
const isAuthenticated = require("../middleware/auth.js");
const User = require("../models/User.js");



router.post("/applyMentor", isAuthenticated, async (req, res) => {
  const { yearsOfExp, inUsername, expertise, tools, skills, introduction } = req.body;
  

  const user = await User.findById(req.user.id);
  
  if (!user) {
    return res.json({ status: "error", error: "Invalid user" });
  }
  
  const emailBody = `
  This is the Mentor Application of ${user.firstName} ${user.lastName}. 
  
  Years of Experience: ${yearsOfExp} 
  Linkedin Username: https://www.linkedin.com/in/${inUsername}/
  Expertise: ${expertise} 
  Tools: ${tools} 
  Skills: ${skills} 
  Introduction: ${introduction} 
  
  click below link to approve or reject the application;
  
  ${process.env.CLIENT_URL_TEST}/applyMentorReview/${user._id}
  `;
  
  try {
    await sendMails({
      //send email to user using nodemailer. configs are in utils/sendMails.js
      email: process.env.ADMIN_EMAIL,
      subject: `GAP Mentor Application of ${user.firstName} ${user.lastName}`,
      message: emailBody,
    });
    res.status(201).json({
      status: "ok",
      success: true,
      message: `Check ${process.env.ADMIN_EMAIL} to review mentor application of ${user.firstName} ${user.lastName}`,
    });
  } catch (error) {
    return res.json({ status: "Failed", error: error.message });
  }
});

//save mentor on database
router.post("/mentor/approved/:userId", async (req, res) => {
  const user = await User.findById(req.params.userId);

const {decision} = req.body;


  if (!user) {
    return res.json({ status: "error", error: "Invalid user" });
  }

  if(decision === 'approved'){
    user.isMentor = true;
  }

  try {
    await user.save();
    res.status(201).json({

      success: true,
      message: `User ${user.firstName} ${user.lastName} is now a mentor`,
    });
  } catch (error) {
    return res.json({ status: "Failed", error: error.message });
  }
});

router.post("/mentor/rejected/:userId", async (req, res) => {
  const user = await User.findById(req.params.userId);

const {decision} = req.body;
console.log(decision);


  if (!user) {
    return res.json({ status: "error", error: "Invalid user" });
  }

  if(decision === 'rejected'){
    user.isMentor = false;
  }

  try {
    await user.save();
    res.status(201).json({
      success: true,
      message: `Mentor application of ${user.firstName} ${user.lastName} was rejected`,
    });
  } catch (error) {
    return res.json({ status: "Failed", error: error.message });
  }
});

router.get("/mentorDetails", async (req, res) => {
  try {
    const mentors = await User.find({ isMentor: true });

    if (!mentors || mentors.length === 0) {
      return res.json({ status: "error", message: "No mentors found" });
    }

    // Map through the mentors and return only the most recent professional detail
    const mentorsWithRecentProfessionalDetail = mentors.map(mentor => {
      const recentProfessionalDetail = mentor.professionalDetails[mentor.professionalDetails.length - 1];
      return { ...mentor._doc, professionalDetails: recentProfessionalDetail };
    });

    return res.json({ status: "ok", mentors: mentorsWithRecentProfessionalDetail });
  } catch (error) {
    return res.json({ status: "error", message: "Internal server error", error: error.message });
  }
});

router.get("/recentMentors", async (req, res) => {
  try {
    const mentors = await User.find({ isMentor: true }).sort({ createdAt: -1 }).limit(4);

    if (!mentors || mentors.length === 0) {
      return res.json({ status: "error", message: "No mentors found" });
    }

    const mentorsWithRecentProfessionalDetail = mentors.map(mentor => {
      const recentProfessionalDetail = mentor.professionalDetails[mentor.professionalDetails.length - 1];
      return { ...mentor._doc, professionalDetails: recentProfessionalDetail };
    });

    return res.json({ status: "ok", mentors: mentorsWithRecentProfessionalDetail });
  } catch (error) {
    return res.json({ status: "error", message: "Internal server error", error: error.message });
  }
});

router.get('/checkMentorStatus', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('isMentor');
    if (!user) {
      return res.status(404).json({ status: 'error', error: 'User not found' });
    }

    // Check if the user is a mentor
    if (user.isMentor == true) {
      res.json({ message: 'User is a Mentor', isMentor: true });
    } else {
      res.json({ message: 'User is not a Mentor', isMentor: false });
    }
  } catch (error) {
    console.error('Error checking mentor status:', error);
    res.status(500).json({ status: 'error', error: 'Server error' });
  }
});

module.exports = router;
