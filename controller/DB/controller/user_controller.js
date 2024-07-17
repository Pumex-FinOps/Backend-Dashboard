const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/userSchema');
const Team = require('../model/applicationSchema')
const { sendEmail } = require('../utils/mail_controller');
const { generateRandomString, generateUniqueUsername } = require('../utils/generators');
secretKey = process.env.secretKey

const userLogIn = async (req, res) => {
    console.log("Welcome");
    const { usernameOrEmail, Password } = req.body;
    try {
        console.log(req.body);
        // Check if user exists with username or email
        const user = await User.findOne({
            $or: [
                { userName: usernameOrEmail },
                { email: usernameOrEmail }
            ]
        });
        console.log(Password);
        console.log(user.password);

        if (user) {
            const isPasswordValid = await bcrypt.compare(Password, user.password);
            console.log(isPasswordValid);

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

        const { email, teamName } = req.body;
        const username = await generateUniqueUsername(email, User);

        const exist = await User.findOne({ email });

        if (exist) {
            return res.status(401).json({ message: 'Email already exists' });
        }

        const password = generateRandomString(12); // Generate random password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = {
            ...req.body,
            userName: username,
            password: hashedPassword
        };

        if (teamName) {
            const team = await Team.findOne({ teamName });

            if (team) {
                // Initialize teamMembers array if it's null
                if (!team.teamMembers) {
                    team.teamMembers = [];
                }
                const newUser = new User(user);
                newUser.team = team._id;
                await newUser.save();
                team.teamMembers.push(newUser._id);
                await team.save();

                //const newUser = new User(user);
                // newUser.team = team._id;
                // await newUser.save();

                console.log(newUser);

                // Uncomment the line below to send an email with user ID and password
                // await sendEmail(email, username, password);

                return res.status(200).json({
                    message: 'User registered successfully',
                    data: {
                        username,
                        email,
                        password
                    }
                });
            } else {
                console.error(`Team ${teamName} not found`);
                return res.status(404).json({ message: `Team ${teamName} not found` });
            }
        } else {
            const newUser = new User(user);
            await newUser.save();

            console.log(newUser);

            // Uncomment the line below to send an email with user ID and password
            // await sendEmail(email, username, password);

            return res.status(200).json({
                message: 'User registered successfully',
                data: {
                    username,
                    email,
                    password
                }
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


const displayUser = async (req, res) => {
    try {
        const display = await User.find().populate("team")
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
        const display = await User.findOne({ _id: req.params._id }).populate("team")
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
