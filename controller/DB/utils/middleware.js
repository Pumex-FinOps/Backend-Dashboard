const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.secretKey; 
const User = require('../model/userSchema'); 

// Middleware to verify JWT and validate user
async function authenticateToken(req, res, next) {
    //console.log("welcome to authenticateToken");

    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // If no token, return unauthorized

    jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                // Handle expired token
                return res.status(401).json({ message: 'Token has expired' });
            }
            // Handle other JWT errors
            return res.status(403).json({ message: 'Invalid token' });
        }
        try {
            const validUser = await User.findById(decoded.userId); 
            if (!validUser) {
                return res.status(401).json({ message: 'User not found' });
            }

            req.user = decoded;
            next(); 
        } catch (error) {
            console.error('Error validating user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
}

module.exports = { authenticateToken };
