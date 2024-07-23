const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/userSchema');
const Team = require('../model/applicationSchema')
const { sendEmail } = require('../utils/mail_controller');
const { generateRandomString, generateUniqueUsername } = require('../utils/generators');
secretKey = process.env.secretKey
const removeSensitiveFields = (obj) => {
    const { password, accessLevel, ...cleanedObj } = obj;
    return cleanedObj;
};

const userLogIn = async (req, res) => {
    console.log("Welcome");
    const { usernameOrEmail, Password } = req.body;
    try {
        console.log(req.body);
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
                if (!team.teamMembers) {
                    team.teamMembers = [];
                }
                const newUser = new User(user);
                newUser.team = team._id;
                await newUser.save();
                team.teamMembers.push(newUser._id);
                await team.save();
                // await newUser.save();

                console.log(newUser);
                console.log("userPassoword", password)

                // Uncomment the line below to send an email with user ID and password
                await sendEmail(email, username, password);

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
            console.log("userPassoword", password)
            await sendEmail(email, username, password);

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
        const cleanedUsers = display.map(user => removeSensitiveFields(user.toObject()))
        res.status(200).json({
            message: "Users data",
            data: cleanedUsers
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error while fetching users' });
    }
};

const getUser = async (req, res) => {
    try {
        const display = await User.findOne({ _id: req.params._id }).populate("team")
        const cleanedUsers = display.map(user => removeSensitiveFields(user.toObject()))
        if (cleanedUsers) {
            res.status(200).json({
                data: cleanedUsers
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

        const teams = await Team.updateMany(
            { teamMembers: userId },
            { $pull: { teamMembers: userId } }
        );

        res.status(200).json({
            message: 'User deleted successfully and removed from teams',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateUser = async (req, res) => {
    try {
        // console.log("inside the updateUser function");
        // console.log(req.body);

        const userId = req.params._id;
        const { teamName, ...otherFields } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update other fields (excluding email, username, and password)
        Object.assign(user, otherFields);

        // Update team if teamName is provided and different from the current team
        if (teamName) {
            const team = await Team.findOne({ teamName });

            if (!team) {
                return res.status(404).json({ message: `Team ${teamName} not found` });
            }

            // Remove user from the old team if it exists
            if (user.team) {
                const oldTeam = await Team.findById(user.team);
                oldTeam.teamMembers = oldTeam.teamMembers.filter(member => member.toString() !== userId);
                await oldTeam.save();
            }

            // Add user to the new team
            user.team = team._id;
            if (!team.teamMembers) {
                team.teamMembers = [];
            }
            team.teamMembers.push(user._id);
            await team.save();
        }

        // Save the updated user
        const updatedUser = await user.save();
        // Exclude sensitive data from response
        const cleanedUser = removeSensitiveFields(updatedUser.toObject());



        return res.status(200).json({
            message: 'User updated successfully',
            data: cleanedUser
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};







module.exports = { userSignUp, displayUser, userLogIn, getUser, deleteUsers, updateUser };
