
const nodemailer = require('nodemailer');

const sendEmail = async (email, userId, password) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email service
        auth: {
            user: 'your-email@gmail.com', // Your email
            pass: 'your-email-password' // Your email password
        }
    });

    let mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Your Account Details',
        text: `Your account has been created successfully.\n\nUser ID: ${userId}\nPassword: ${password}`
    };

    await transporter.sendMail(mailOptions);
}

module.exports = { sendEmail };
