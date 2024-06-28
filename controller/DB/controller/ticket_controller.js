const Ticket = require('../model/ticketSchema');

// Function to create a new ticket
const createTicket = async (req, res) => {
    try {
        const ticket = new Ticket(req.body);
        const savedTicket = await ticket.save();
        res.status(201).json({
            message: 'Ticket created successfully',
            data: savedTicket
        });
    } catch (error) {
        res.status(400).json({ error: `Could not create ticket: ${error.message}` });
    }
};

// Function to fetch all tickets
const getAllTickets = async (req, res) => {
    try {
        let query = {}; // Default query to fetch all tickets

        const { status } = req.query;
        if (status) {
            // If status parameter is provided, filter by status
            query.status = status;
        }

        const tickets = await Ticket.find(query).sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: `Could not fetch tickets: ${error.message}` });
    }
};

// Function to fetch a ticket by ID
const getTicketById = async (req, res) => {
    const ticketId = req.params.id;
    try {
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ error: `Ticket not found with ID: ${ticketId}` });
        }
        res.json(ticket);
    } catch (error) {
        res.status(500).json({ error: `Could not fetch ticket: ${error.message}` });
    }
};

// Function to update a ticket by ID
const updateTicket = async (req, res) => {
    const ticketId = req.params.id;
    const updateData = req.body;
    try {
        const updatedTicket = await Ticket.findByIdAndUpdate(ticketId, updateData, { new: true });
        if (!updatedTicket) {
            return res.status(404).json({ error: `Ticket not found with ID: ${ticketId}` });
        }
        res.json({
            message: 'Ticket updated successfully',
            data: updatedTicket
        });
    } catch (error) {
        res.status(500).json({ error: `Could not update ticket: ${error.message}` });
    }
};

// Function to delete a ticket by ID
const deleteTicket = async (req, res) => {
    const ticketId = req.params.id;
    try {
        const deletedTicket = await Ticket.findByIdAndDelete(ticketId);
        if (!deletedTicket) {
            return res.status(404).json({ error: `Ticket not found with ID: ${ticketId}` });
        }
        res.json({
            message: 'Ticket deleted successfully',
            data: deletedTicket
        });
    } catch (error) {
        res.status(500).json({ error: `Could not delete ticket: ${error.message}` });
    }
};

// Function to fetch tickets assigned to a specific member (user)
const getTicketsByAssignedMember = async (req, res) => {
    const memberId = req.params.memberId;
    try {
        const tickets = await Ticket.find({ assignedMember: memberId })
            .populate('userId', 'name')
            .sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: `Could not fetch tickets for assigned member: ${error.message}` });
    }
};

// Function to fetch tickets assigned to a specific team
const getTicketsByTeam = async (req, res) => {
    const teamId = req.params.teamId;
    try {
        const tickets = await Ticket.find({ teamId })
            .populate('assignedMember', 'name email')
            .sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: `Could not fetch tickets for team: ${error.message}` });
    }
};

// Function to fetch tickets assigned to a specific user (userId)
const getTicketsByUserId = async (req, res) => {
    const userId = req.params.userId;
    try {
        const tickets = await Ticket.find({ userId })
            .populate('assignedMember', 'name email')
            .sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: `Could not fetch tickets for user: ${error.message}` });
    }
};

module.exports = {
    createTicket,
    getAllTickets,
    getTicketById,
    updateTicket,
    deleteTicket,
    getTicketsByAssignedMember,
    getTicketsByTeam,
    getTicketsByUserId,
};
