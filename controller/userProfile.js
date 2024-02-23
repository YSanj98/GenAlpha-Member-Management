const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const User = require("../models/User.js");
const isAuthenticated = require("../middleware/auth.js");
const cloudinary = require("cloudinary");


//get user api endpoint---------------------------------------------------------------------------------------------------------------------------
router.get("/getUser", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

//get profile picture api endpoint---------------------------------------------------------------------------------------------------------------------------
router.get("/getUserImage", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("profilePicture");
    res.json(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

//get interest api endpoint---------------------------------------------------------------------------------------------------------------------------
router.get("/getInterest", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("fieldOfInterest");
    res.json(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

//get social links api endpoint---------------------------------------------------------------------------------------------------------------------------
router.get("/getSocialLinks", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("socialMedia");
    res.json(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

//add personal details api endpoint---------------------------------------------------------------------------------------------------------------------------
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

//add academic details api endpoint---------------------------------------------------------------------------------------------------------------------------
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

//add professional details api endpoint---------------------------------------------------------------------------------------------------------------------------
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

//add social media api endpoint---------------------------------------------------------------------------------------------------------------------------
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

//add field of interest api endpoint---------------------------------------------------------------------------------------------------------------------------
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

//edit academic details api endpoint---------------------------------------------------------------------------------------------------------------------------
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
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ status: "error", error: "Username already in use" });
    }
    throw error;
  }
});

//delete academic api endpoint---------------------------------------------------------------------------------------------------------------------------
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

// delete professional qualification api endpoint---------------------------------------------------------------------------------------------------------------------------
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
      .json({
        status: "ok",
        message: "professional qualification deleted successfully",
      });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Server error" });
  }
});

// delete interest api endpoint---------------------------------------------------------------------------------------------------------------------------
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

//profile picture upload api endpoint---------------------------------------------------------------------------------------------------------------------------
router.post("/photoUpload", isAuthenticated, async (req, res) => {
  try {
    const fileStr = req.body.data;

    const user = await User.findById(req.user.id);
    const currentProfilePictureUrl = user.profilePicture;

    let publicId;
    if (currentProfilePictureUrl) {
      publicId = currentProfilePictureUrl.split('/').pop().split('.')[0];
    }

    const uploadResponse = await cloudinary.v2.uploader.upload(fileStr, {
      folder: "generationalpha",
      overwrite: true,
      public_id: publicId ,
      secure: true
    });

    user.profilePicture = uploadResponse.url;
    await user.save();

    console.log(uploadResponse);
    console.log(uploadResponse.url);

    res.json({ status: "ok", message: "Image uploaded successfully" });
  } catch (error) {
    console.error("Error uploading photo:", error);
    res.json({ status: "error", error: "Something Went Wrong" });
  }
});

//profile picture delete api endpoint---------------------------------------------------------------------------------------------------------------------------    
router.delete("/deleteProfilePicture", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const currentProfilePictureUrl = user.profilePicture;

    let publicId;

    if (currentProfilePictureUrl) {
      publicId = currentProfilePictureUrl.split('/').pop().split('.')[0];
    }

    if (publicId) {
      await cloudinary.v2.uploader.destroy(publicId);
    }

    user.profilePicture = null;
    await user.save();

    res.json({ status: "ok", message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting photo:", error);
    res.json({ status: "error", error: "Something Went Wrong" });
  }
});


module.exports = router;
