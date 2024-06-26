const mongoose = require('mongoose');

// Define Comment schema
const commentSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ticketId: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true  
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
