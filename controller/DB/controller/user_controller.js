const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/userSchema');
const { sendEmail } = require('../utils/mail_controller');
const { generateRandomString, generateUniqueUsername } = require('../utils/generators');
secretKey = process.env.secretKey

const userLogIn = async (req, res) => {
    console.log("Welcome");
    const { usernameOrEmail, password } = req.body;
    try {
        console.log(req.body);
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
                const token = jwt.sign({ userId: user._id, accessLevel: user.accessLevel, name: user.userName }, secretKey, { expiresIn: '1h' });
                return res.status(200).json({
                    message: `${user.userName} login successful`,
                    token: token,
                    accessLevel: user.accessLevel,
                    uId: user._id,
                    data: {
                        email: user.email
                    }
                });
            } else {
                return res.status(401).json('Invalid password');
            }

        } else {
            return res.status(401).json('User not found');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
};

const userSignUp = async (req, res) => {
    try {
        console.log("inside the signUp page");
        console.log(req.body);

        const email = req.body.email;
        const username = await generateUniqueUsername(email, User);

        const exist = await User.findOne({
            email: email
        });

        if (exist) {
            if (exist.email === email) {
                return res.status(401).json({ message: 'Email already exists' });
            }
        } else {
            const password = generateRandomString(12); // Generate random password
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = {
                ...req.body,
                userName: username,
                password: hashedPassword
            };

            const newUser = new User(user);
            await newUser.save();
            console.log(newUser);

            //await sendEmail(email, username, password); // Send email with user ID and password

            res.status(200).json({
                message: 'User registered successfully',
                data: {
                    username: username,
                    email: email,
                    password: password

                }
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
};

const displayUser = async (req, res) => {
    try {
        const display = await User.find();
        res.status(200).json({
            message: "Users data",
            data: display
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error while fetching users' });
    }
};

const getUser = async (req, res) => {
    try {
        const display = await User.findOne({ _id: req.params._id });
        if (display) {
            res.status(200).json({
                data: display
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error while fetching user' });
    }
};

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
};

module.exports = { userSignUp, displayUser, userLogIn, getUser, deleteUsers };
