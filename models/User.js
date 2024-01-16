const mongoose = require("mongoose");
const schema = mongoose.Schema;
const crypto = require("crypto");

const userSchema = new schema(
  {
    username: {
      type: String,
      required: [true, "Please enter your username"],
      unique: true,
    },
    firstName: {
      type: String,
      required: [true, "Please enter your first name"],
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minLength: [4, "Password should be greater than 4 characters"],
      select: false,
    },
    phoneNumber: {
      type: Number,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpire: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * (30 * 1000);
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
