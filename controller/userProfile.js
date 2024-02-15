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

router.post("/editAcademic/:id", isAuthenticated, async (req, res) => {
  const { institute, degree, startDate, endDate, grade } = req.body;

  const user = await User.findById(req.user.id);

  try {
    const academicIndex = user.academicDetails.findIndex(
      (academic) => academic.id === req.params.id
    );

    if (academicIndex === -1) {
      return res
        .status(404)
        .json({ status: "error", error: "Academic Qualification not found" });
    }

    user.academicDetails[academicIndex].institute = institute;
    user.academicDetails[academicIndex].degree = degree;
    user.academicDetails[academicIndex].startDate = startDate;
    user.academicDetails[academicIndex].endDate = endDate;
    user.academicDetails[academicIndex].grade = grade;

    await user.save();

    res
      .status(200)
      .json({ status: "ok", message: "Academic updated successfully" });

  }catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ status: "error", error: "Username already in use" });
    }
    throw error;
  }

});

router.delete("/deleteAcademic/:id", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ status: "error", error: "User not found" });
    }

    const academicIndex = user.academicDetails.findIndex(
      (academic) => academic.id === req.params.id
    );

    if (academicIndex === -1) {
      return res
        .status(404)
        .json({ status: "error", error: "Academic Qualification not found" });
    }
    user.academicDetails.splice(academicIndex, 1);
    await user.save();
    res
      .status(200)
      .json({ status: "ok", message: "Academic deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Server error" });
  }
});

router.delete("/deleteProfessional/:id", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ status: "error", error: "User not found" });
    }

    const professionalIndex = user.professionalDetails.findIndex(
      (professional) => professional.id === req.params.id
    );

    if (professionalIndex === -1) {
      return res
        .status(404)
        .json({ status: "error", error: "Academic Qualification not found" });
    }
    user.professionalDetails.splice(professionalIndex, 1);
    await user.save();
    res
      .status(200)
      .json({ status: "ok", message: "professional qualification deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Server error" });
  }
});

router.delete("/deleteInterest/:id", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ status: "error", error: "User not found" });
    }

    const interestIndex = user.fieldOfInterest.findIndex(
      (interest) => interest.id === req.params.id
    );

    if (interestIndex === -1) {
      return res
        .status(404)
        .json({ status: "error", error: "Interest not found" });
    }

    user.fieldOfInterest.splice(interestIndex, 1);

    await user.save();

    res
      .status(200)
      .json({ status: "ok", message: "Interest deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Server error" });
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
