const bcrypt = require('bcrypt');
const User = require('../model/userSchema');
const { sendEmail } = require('../utils/mail_controller');
const { generateRandomString, generateUniqueUsername } = require('../utils/generators');

const userSignUp = async (request, response) => {
    try {
        console.log("inside the signUp page");
        console.log(request.body);

        const email = request.body.email;
        const username = await generateUniqueUsername(email, User);

        const exist = await User.findOne({

            email: email

        });

        if (exist) {
            if (exist.email === email) {
                return response.status(401).json({ message: 'Email already exists' });
            }
        } else {
            const password = generateRandomString(12); // Generate random password
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = {
                ...request.body,
                userName: username,
                password: hashedPassword
            };

            const newUser = new User(user);
            await newUser.save();
            console.log(newUser);

            //await sendEmail(email, username, password); // Send email with user ID and password

            response.status(200).json({
                message: 'User registered successfully',
                data: {
                    username: username,
                    email: email
                }
            });
        }
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: error });
    }
}

module.exports = { userSignUp };
