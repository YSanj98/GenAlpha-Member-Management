const express = require("express");
const router = express.Router();

const User = require("../models/User.js");
const isAuthenticated= require("../middleware/auth.js");

router.get("/getUser", isAuthenticated, async (req, res) =>{
    try{
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    }catch(err){
        console.log(err);
        res.status(500).send("Server error");
    }
});

router.post("/personalDetails", isAuthenticated, async (req, res) =>{
    const { address, gender, birthday, about, portfolioLink } =
    req.body;

    const user = await User.findById(req.user.id)

    try { 
        const response = await User.updateOne(
            { _id: req.user.id },
            {
              $set: {
                address,
                gender,
                birthday,
                about,
                portfolioLink,
              },
            }
          );
        console.log("Details added successfully: ", response);
        res.status(200).json({ status: "ok" , message: "Details added successfully" });
      }catch (error) {
        if (error.code === 11000) {
          return res
            .status(409)
            .json({ status: "error", error: "Username already in use" });
        }
        throw error;
      } 
});

module.exports = router;