const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../models/User.js");
const isAuthenticated = require("../middleware/auth.js");

router.get("/getUser", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

router.post("/personalDetails", isAuthenticated, async (req, res) => {
  const { address, gender, birthday, about, portfolioLink } = req.body;

  const user = await User.findById(req.user.id);

  try {
    const response = await User.updateOne(
      { _id: req.user.id },
      {
        $set: {
          personalDetails: {
            address,
            gender,
            birthday,
            about,
            portfolioLink,
          },
        },
      }
    );
    console.log("Details added successfully: ", response);
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
  const { Institute, Degree, StartDate, EndDate, Grade } = req.body;

  const user = await User.findById(req.user.id);

  try {
    const response = await User.updateOne(
      { _id: req.user.id },
      {
        $set: {
          academicDetails: {
            Institute,
            Degree,
            StartDate,
            EndDate,
            Grade,
          },
        },
      }
    );
    console.log("Details added successfully: ", response);
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

router.post("/SocialMedia", isAuthenticated, async (req, res) => {
  const { linkedinLink, portfolioLink } = req.body;

  const user = await User.findById(req.user.id);

  try {
    const response = await User.updateOne(
      { _id: req.user.id },
      {
        $set: {
          linkedinLink,
          portfolioLink,
        },
      }
    );
    console.log("Details added successfully: ", response);
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

module.exports = router;
