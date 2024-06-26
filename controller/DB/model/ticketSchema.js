const mongoose = require('mongoose');
const ticketSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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
    attachments: [String],  // Array of attachment URLs or file paths
    teamId: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
    },
    assignedMember: {
        type: Schema.Types.ObjectId,
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
    timestamps: true  // Adds createdAt and updatedAt automatically
});

// Create Ticket model
const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
