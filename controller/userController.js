const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOTP } = require("../controller/userController.js");
const User = require("/models/User");
const OTP = require("./models");
const Model = require('./models');

const UserOTPVerification = require("./../models/UserOTPVerification.js");

//nodemailer stuff
let transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});





router.post("/register", async (req, res, next) => {
  const { username, email, password, phoneNumber } = req.body;

  if (!username || typeof username !== "string") {
    return res.json({ status: "error", error: "Invalid username" });
  }

  if (!email || typeof email !== "string") {
    return res.json({ status: "error", error: "Invalid email" });
  }

  try {
    const hashPassword = await bcrypt.hash(password, 12);

    const response = await User.create({
      username,
      email,
      password: hashPassword,
      phoneNumber,
      verified: false,
    });
    newUser
     .save()
     .then((result) => {
      sendOTPVerificationEmail(result, res)
     })
    console.log("User created successfully: ", response);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ status: "error", error: "Username already in use" });
    }
    throw error;
  }
  res.json({ status: "ok" });
});

router.post("/sign", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select('+password');

  if (!user) {
    return res.status(401).json({ status: "error", error: "Invalid username or password" });
  }

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET
    );
    return res.json({ status: "ok", data: token });
  } else {
    return res.status(401).json({ status: "error", error: "Invalid username or password" });
  }
});


//otp
/*const sendOTP = async ({ email, subject, massage,
  duration = 1 }) => {
      try {
          if (!(email && subject && message)){
          throw error("provide values for email, subject, massage");
      }
  
      await OTP.deleteOne({ email });
  
  } catch (error) {
  
  }
  
  };



const sendPasswordResetOTPEmail = async (email) => {
  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw Error("There's no account for the provided email.");
    }

    if (!existingUser.verified) {
      throw Error("Email hasn't been verified yet. Check your inbox.");
    }

    const otpDetails = {
      email,
      subject: "Password Reset",
      message: "Enter the code below to reset your password",
      duration: 1,
    };
    const createdOTP = await sendOTP(otpDetails);
    return createdOTP;
  } catch (error) {
    throw error;
  }
};

module.exports = { sendPasswordResetOTPEmail };*/


//send otp verification email
const sendOTPVerificationEmail = async () => {
  try{
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
  

//mail options
const mailOption = {
  from: process.env.AUTH_EMAIL,
  to: email,
  subject: "verify Your Email",
  html: `<P> Enter <b>${otp}</b> in the app to verify your email address and complete</P>
  <P>this code <b>expiress in 1 houre</b>.</P>`,

};


//hash the otp
const saltRounds = 10;

const hashOTP = await bcrypt.hash(otp, saltRounds);
const newOTPverification = await new UserOTPVerification({
  userid: _id,
  otp: hasheOTP,
  createdAt: Date.now(),
  expiredAt: Date.now() + 3600000,
});
//save otp record
await newOTPverification.save();
await transporter.sendmail(mailOptions);
res.json({
  status: "PENDING",
  message: "Verfication otp email sent",
  date: {
    userid: _id,
    email,
  },
});
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.massage,

    });

  }
};


//verfy otp email
router.post("/verifyOTP", async (req, res) => {
  try{
    let { userId, otp } = req.body;
    if(!userId || !otp) {
      throw Error("Empty otp details are not allowed");

    } else {

const UserOTPVerificationRecords = await UserOTPVerification.find({
  userId,
});
if (UserOTPVerificationRecords.length <= 0){
  throw new Error (
    "Account record doesn't exist or has been verified already. please sing up or log in."
  );
} else {
  const { expiresAt } = UserOTPVerificationRecords[0];
  const hasheOTP = UserOTPVerificationRecords[0];

  if(expiresAt < Date.now()){
    await UserOTPVerification.deletmany({userId});
    throw new Error(" code has expired. please request agin.");

  }else{
    const validOTP = await bcrypt.compare(otp,hashedOTP);

    if(!validOTP){
      throw new Error("invalide code passed. check");
    } else{
      await User.updateOne({_id: userid}, { verified: true});
      await UserOTPVerification.deleteMany({ userId});
      res.json({
        status: "VERIFIED",
        message: `User email verified succ.`,
      });
    }

  }
}
 }
  } catch (error){
res.json({
  status: "FAILED",
  message: error.message,
});
  }
});


//resend verificattion
router.post("/resendOTPVerificationCode", async(req,res)=> {
try{
  let { userId, email } = req.body;

  if(!userId || !email){
    throw Error(" Empty user details are not allowed");
  }   else {
    await UserOTPVerification.deleteMany({ userId });
    sendOTPVerificationEmail({_id: user, email }, res);
  }
  } catch (error){
    res.json({
      status: "FAILED",
      message: error.message,

    });
  }

});
  












module.exports = router;
