const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    name: {
        type: String,
        required: [true, 'Please enter your name']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
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
