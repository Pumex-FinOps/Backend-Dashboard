const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        max: 20
    },
    appCode: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true,
        lowercase: false,
        max: 20
    },
    costCode: {
        type: Number,
        required: true,
        trim: true,
        index: true,
        lowercase: true
    },
    supportEmail: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    appOwners: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        //required: true,
        trim: true,
        max: 20
    },
    projectManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        trim: true,
        max: 20
    },
    teamMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }]
},
    {
        timestamps: true
    });

const team = mongoose.model('teams', applicationSchema);

module.exports = team;