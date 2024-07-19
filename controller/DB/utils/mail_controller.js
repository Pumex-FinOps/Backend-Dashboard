
const nodemailer = require('nodemailer');
const Email = process.env.EMAIL;
const Password = process.env.EMAIL_PASS;

const sendEmail = async (email, userId, password) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email service
        auth: {
            user: Email,
            pass: Password 
        }
    });

    let mailOptions = {
        from: Email,
        to: email,
        subject: 'Your Account Details',
        text: `Your account has been created successfully.\n\nUser ID: ${userId}\nPassword: ${password}`
    };

    await transporter.sendMail(mailOptions);
}

module.exports = { sendEmail };
