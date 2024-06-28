const Comment = require('../model/commentSchema');

// Function to create a new comment
const createComment = async (req, res) => {
    try {
        const { userId, ticketId, comment } = req.body;
        const newComment = new Comment({ userId, ticketId, comment });
        const savedComment = await newComment.save();
        
        res.status(201).json({
            message: 'Comment created successfully',
            data: {
                commentId: savedComment._id
            }
        });
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Could not create comment' });
    }
};

// Function to fetch comments by ticketId
const getCommentsByTicketId = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const comments = await Comment.find({ ticketId })
            .populate('userId', 'name email') // Optionally populate user details
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments by ticketId:', error);
        res.status(500).json({ error: 'Could not fetch comments' });
    }
};

// Function to fetch comments by userId
const getCommentsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const comments = await Comment.find({ userId })
            .populate('ticketId', 'shortDescription') // Optionally populate ticket details
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments by userId:', error);
        res.status(500).json({ error: 'Could not fetch comments' });
    }
};

// Function to update a comment by ID
const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedComment = await Comment.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedComment) {
            return res.status(404).json({ error: `Comment not found with ID: ${id}` });
        }
        res.json({
            message: 'Comment updated successfully',
            data: updatedComment
        });
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ error: 'Could not update comment' });
    }
};

// Function to delete a comment by ID
const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedComment = await Comment.findByIdAndDelete(id);
        if (!deletedComment) {
            return res.status(404).json({ error: `Comment not found with ID: ${id}` });
        }
        res.json({
            message: 'Comment deleted successfully',
            data: deletedComment
        });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Could not delete comment' });
    }
};

module.exports = {
    createComment,
    getCommentsByTicketId,
    getCommentsByUserId,
    updateComment,
    deleteComment,
};
