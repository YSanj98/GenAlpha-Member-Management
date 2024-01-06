const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    username: {
        type: String,
        required: [true, 'Please enter your name'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minLength: [4, "Password should be greater than 4 characters"],
        select: false
    },
    phoneNumber:{
        type: Number,
      },
}, {timestamps: true});

module.exports = mongoose.model("User", userSchema);
