const router = require("express").Router();
const passport = require("passport");

router.get("/login/success", (req,res)=>{
    if(req.user){
        res.status(200).json({
            error:false,
            message:"Login Success",
            user:req.user,
        })
    }else{
        res.status(403).json({
            error:true,
            message:"Not Authorized",
        });
    }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Login Failed",
  });
});

router.get(
  "/google/Callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/home",
    failureRedirect: "http://localhost:3000/login",
  })
);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

module.exports = router;