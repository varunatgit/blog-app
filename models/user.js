const mongoose = require('mongoose');

//user schema
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: 1
    },
    email: {
        type: String,
        required: 1
    },
    username: {
        type: String,
        required: 1
    },
    password: {
        type: String,
        required: 1
    }
});

const User = module.exports = mongoose.model('User', userSchema);