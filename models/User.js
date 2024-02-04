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
    personalDetails: [
      {
        title: {
          type: String,
        },
        address: {
          type: String,
        },
        telephone: {
          type: Number,
        },
        gender: {
          type: String,
        },
        birthday: {
          type: Date,
        },
        description: {
          type: String,
        },
        portfolioLink: {
          type: String,
        }, 
      }
    ],
    socialMedia: [
      {
        portfolioLink: {
          type: String,
        },
        linkedinLink: {
          type: String,
        },
      }
    ],
    academicDetails: [
      {
        institute: {
          type: String,
        },
        degree: {
          type: String,
        },
        startDate: {
          type: Date,
        },
        endDate: {
          type: Date,
        },
        grade: {
          type: String,
        },
      },
    ],
    professionalDetails: [
      {
        position: {
          type: String,
        },
        empType: {
          type: String,
        },
        companyName: {
          type: String,
        },
        locationType: {
          type: String,
        },
        startDate: {
          type: Date,
        },
        endDate: {
          type: Date,
        },
        skills: {
          type: String,
        },
      },
    ],

  },
  { timestamps: true }
);

userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpire = Date.now() + 10 * (30 * 1000);
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
