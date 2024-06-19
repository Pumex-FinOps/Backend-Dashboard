const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        max: 20
    },
    userName: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true,
        lowercase: true,
        max: 20
    },
    userId: {
        type: Number,
        required: true,
        trim: true,
        unique: true,
        index: true,
        lowercase: true
    },
    managerName: {
        type: String,
        required: true,
        trim: true,
        max: 20
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    position: {
        type: String,
        //required: true,
        trim: true,
        max: 20
    },
    team: {
        type: String,
        //required: true,
        trim: true,
        max: 20
    },
    password: {
        type: String,
        required: true
    },
    accessLevel: {
        type: String,
        enum: ['managementView', 'teamView', 'adminView'],
        required: true
    },
    userType: {
        type: String,
        enum: ['Full Time', 'Contractors', 'Intern'],
        required: true
    },
    userImage: { type: String }

},
    {
        timestamps: true
    });

const User = mongoose.model('users', userSchema);

module.exports = User;