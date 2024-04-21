const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const User = require("../models/User.js");
const isAuthenticated = require("../middleware/auth.js");
const { upload } = require("../utils/multer.js");
const mongoose = require("mongoose");

// Function to format date to YYYY/MM/DD format
function formatDate(date) {
  const formattedDate = new Date(date);
  const year = formattedDate.getFullYear();
  const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
  const day = String(formattedDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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

//get academic details for edit api endpoint---------------------------------------------------------------------------------------------------------------------------
router.get("/getAcademicDetails/:id", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("academicDetails");
    // Directly using the _id property for comparison
    const academic = user.academicDetails.find(
      (academicDetail) => academicDetail._id.toString() === req.params.id
    );
    if (academic) {
      // Format start date and end date to YYYY/MM/DD format
      const formattedAcademic = {
        ...academic._doc,
        startDate: formatDate(academic.startDate),
        endDate: formatDate(academic.endDate),
      };
      res.json({ academic: formattedAcademic }); // Send back the found academic detail with formatted dates
    } else {
      res.status(404).send("Academic detail not found");
    }
  } catch (err) {
    console.error(err); // Logging the actual error can help in debugging
    res.status(500).send("Server error");
  }
});

//get professional details for edit api endpoint---------------------------------------------------------------------------------------------------------------------------
router.get("/getProfessionalDetails/:id", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("professionalDetails");
    // Directly using the _id property for comparison
    const professional = user.professionalDetails.find(
      (professionalDetails) =>
        professionalDetails._id.toString() === req.params.id
    );
    if (professional) {
      // Format start date and end date to YYYY/MM/DD format
      const formattedProfessional = {
        ...professional._doc,
        startDate: formatDate(professional.startDate),
        endDate: formatDate(professional.endDate),
      };
      res.json({ professional: formattedProfessional }); // Send back the found professional detail with formatted dates
    } else {
      res.status(404).send("Professional detail not found");
    }
  } catch (err) {
    console.error(err); // Logging the actual error can help in debugging
    res.status(500).send("Server error");
  }
});

//get about api endpoint---------------------------------------------------------------------------------------------------------------------------
router.get("/getAbout", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({status: "ok" , about: user.about});
  } catch (err) {
    res.status(500).send("Server error");
  }
});

//add about  api endpoint---------------------------------------------------------------------------------------------------------------------------
router.post("/about", isAuthenticated, async (req, res) => {
  const { about } = req.body;

  const user = await User.findById(req.user.id);
  try {
    await User.updateOne(
      { _id: req.user.id },
      {
        $set: {
          about,
        },
      }
    );

    res.json({ status: "ok", message: "About added successfully" });
  } catch (err) {

    res.json({ status: "error", error: "Server error" });
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

//
router.post("/editedAcademicDetails/:id", isAuthenticated, async (req, res) => {
  const { institute, degree, startDate, endDate, grade } = req.body;

  const user = await User.findById(req.user.id);

  try {
    const response = await User.updateOne(
      { _id: req.user.id },

      {
        $set: {
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

router.post(
  "/editedProfessionalDetails/:id",
  isAuthenticated,
  async (req, res) => {
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
          $set: {
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
  }
);

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
    res.status(200).json({
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
      if (error.code === 413) {
        return res.json({ status: "error", error: "Payload too large" });
      }
      return res.json({ status: "error", error: "Server error" });
    }
  }
);

//profile picture delete api endpoint---------------------------------------------------------------------------------------------------------------------------
router.delete("/deleteProfilePicture", isAuthenticated, async (req, res) => {
  const user = await User.findById(req.user.id);
  try {
    // Check if the user has a profile picture
    if (!user.profilePicture) {
      return res.json({
        status: "error",
        error: "No photo found for the user",
      });
    }

    // Get the filename of the profile picture
    const filename = path.join(__dirname, "..", "public", "images", user.profilePicture);

    // Delete the file from the filesystem
    fs.unlink(filename, async (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return res.json({ status: "error", error: "Failed to delete photo" });
      }

      // Update the user's profilePicture field to null
      const response = await User.updateOne(
        { _id: req.user.id },
        { $set: { profilePicture: null } }
      );

      res.json({ status: "ok", message: "Photo deleted successfully" });
    });
  } catch (error) {
    console.error("Error deleting photo:", error);
    res.json({ status: "error", error: "Internal server error" });
  }
});

module.exports = router;
