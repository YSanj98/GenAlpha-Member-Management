const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const User = require("../models/User.js");
const isAuthenticated = require("../middleware/auth.js");
const { upload } = require("../utils/multer.js");

router.get("/getUser", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

router.get("/getUserImage", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("profilePicture");
    res.json(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

router.get("/getInterest", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("fieldOfInterest");
    res.json(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

router.get("/getSocialLinks", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("socialMedia");
    res.json(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

router.post("/personalDetails", isAuthenticated, async (req, res) => {
  const {
    title,
    address,
    telephone,
    gender,
    birthday,
    description,
    portfolioLink,
  } = req.body;

  const user = await User.findById(req.user.id);

  try {
    const response = await User.updateOne(
      { _id: req.user.id },
      {
        $set: {
          personalDetails: {
            title,
            address,
            telephone,
            gender,
            birthday,
            description,
            portfolioLink,
          },
        },
      }
    );

    res
      .status(200)
      .json({ status: "ok", message: "Details added successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ status: "error", error: "Username already in use" });
    }
    throw error;
  }
});

router.post("/academicDetails", isAuthenticated, async (req, res) => {
  const { institute, degree, startDate, endDate, grade } = req.body;

  const user = await User.findById(req.user.id);

  try {
    const response = await User.updateOne(
      { _id: req.user.id },
      {
        $push: {
          academicDetails: {
            institute,
            degree,
            startDate,
            endDate,
            grade,
          },
        },
      }
    );
    
    res
      .status(200)
      .json({ status: "ok", message: "Details added successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ status: "error", error: "Username already in use" });
    }
    throw error;
  }
});

router.post("/professionalDetails", isAuthenticated, async (req, res) => {
  const {
    position,
    empType,
    companyName,
    locationType,
    startDate,
    endDate,
    skills,
  } = req.body;

  const user = await User.findById(req.user.id);

  try {
    const response = await User.updateOne(
      { _id: req.user.id },
      {
        $push: {
          professionalDetails: {
            position,
            empType,
            companyName,
            locationType,
            startDate,
            endDate,
            skills,
          },
        },
      }
    );

    res.status(200).json({
      status: "ok",
      message: "Professional details added successfully",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ status: "error", error: "Username already in use" });
    }
    throw error;
  }
});

router.post("/SocialMedia", isAuthenticated, async (req, res) => {
  const { linkedinLink, websiteLink } = req.body;

  const user = await User.findById(req.user.id);

  try {
    const response = await User.updateOne(
      { _id: req.user.id },
      {
        $set: {
          socialMedia: {
            linkedinLink,
            websiteLink,
          },
        },
      }
    );

    res
      .status(200)
      .json({ status: "ok", message: "Details added successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ status: "error", error: "Username already in use" });
    }
    throw error;
  }
});

router.post("/fieldOfInterest", isAuthenticated, async (req, res) => {
  const { interest } = req.body;

  const user = await User.findById(req.user.id);

  try {
    const response = await User.updateOne(
      { _id: req.user.id },
      {
        $push: {
          fieldOfInterest: {
            interest,
          },
        },
      }
    );

    res
      .status(200)
      .json({ status: "ok", message: "Interest added successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ status: "error", error: "Username already in use" });
    }
    throw error;
  }
});

router.post(
  "/photoUpload",
  upload.single("file"),
  isAuthenticated,
  async (req, res) => {
    const user = await User.findById(req.user.id);
    try {
      const filename = req.file.filename;
      const fileUrl = path.join(filename);

      const response = await User.updateOne(
        { _id: req.user.id },
        {
          $set: {
            profilePicture: fileUrl,
          },
        }
      );

      res
        .status(200)
        .json({ status: "ok", message: "Photo uploaded successfully" });
    } catch (error) {
      if (error.code === 11000) {
        return res
          .status(409)
          .json({ status: "error", error: "Username already in use" });
      }
      throw error;
    }
  }
);

module.exports = router;
