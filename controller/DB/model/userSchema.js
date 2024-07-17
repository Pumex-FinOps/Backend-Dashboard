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
    managerName: {
        type: String,
        // required: true,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teams',
        default: null 

    },
    password: {
        type: String,
        required: true
    },
    accessLevel: {
        type: String,
        enum: ['Management Level', 'Engineer Level', 'Admin Level'],
        required: true
    },
    userType: {
        type: String,
        enum: ['Full time', 'Intern', 'Contractors'],
        required: true
    },
    userImage: { type: String }

},
    {
        timestamps: true
    });

const User = mongoose.model('users', userSchema);

module.exports = User;