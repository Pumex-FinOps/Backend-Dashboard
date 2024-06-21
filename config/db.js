const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config();
const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD

//const dbURI = `mongodb+srv://${username}:${password}@cluster0.08tziw5.mongodb.net/Clouddashboard`
const dbURI = "mongodb://ec2-3-85-14-92.compute-1.amazonaws.com:27017/Clouddashboard"


mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Get the default connection
const db = mongoose.connection;

// Event handlers for the connection
db.on('connected', () => {
    console.log('Connected to MongoDB');
});

db.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err);
});
module.exports = db