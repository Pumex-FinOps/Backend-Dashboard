const bcrypt = require('bcrypt');
const User = require('../model/userSchema');
const { sendEmail } = require('../utils/mail_controller');
const { generateRandomString, generateUniqueUsername } = require('../utils/generators');

const userLogIn = async (request, response) => {
    console.log("Welcome");
    const { usernameOrEmail, password } = request.body;
    try {
        console.log(request.body);
        // Check if user exists with username or email
        const user = await User.findOne({
            $or: [
                { userName: usernameOrEmail },
                { email: usernameOrEmail }
            ]
        });
        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                const token = jwt.sign({ userId: user._id, accessLevel: user.accessLevel, name: userName }, secretKey, { expiresIn: '1h' });
                return response.status(200).json({
                    message: `${user.userName} login successful`,
                    token: token,
                    uId: user._id,
                    data: {
                        email: user.email
                    }
                });
            } else {
                return response.status(401).json('Invalid password');
            }

        } else {
            return response.status(401).json('User not found');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        response.status(500).json({ message: 'Error logging in' });
    }
};

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
const displayUser = async (request, response) => {

    try {
        const display = await User.find();
        response.status(201).json({
            message: "users data",
            data: {
                data: display
            }
        });

    } catch (error) {
        console.log(error);
        console.log(error);
        response.status(500).json({ message: 'Error while display' });
    }


}
const getUser = async (request, response) => {
    try {
        const display = await User.findOne({ _id: request.params._id });
        // console.log(request.params._id)

        if (display) {
            response.status(200).json({
                data:
                    { data: display }
            });
        } else {
            response.status(404).json({ message: 'User not found' });
        }
    } catch (error) {

        console.error(error);
        response.status(500).json({ message: 'Error while fetching user' });
    }
}
const deleteUsers = async (req, res) => {

    const userId = req.params._id;
    try {
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully', deletedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }

}

module.exports = { userSignUp, displayUser, userLogIn, getUser, deleteUsers, };
