const mongoose = require('mongoose');
const ticketSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true
    },
    longDescription: {
        type: String,
        required: true
    },
    attachments: [String],  
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
    },
    assignedMember: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
        default: 'Open'
    }
}, {
    timestamps: true  
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
