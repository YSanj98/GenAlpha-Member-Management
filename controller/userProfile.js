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

module.exports = router;