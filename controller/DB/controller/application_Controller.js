const bcrypt = require('bcrypt');
const Team = require('../model/applicationSchema');

const applicationSignup = async (request, response) => {
    try {
        console.log("inside the signUp page");
        console.log(request.body);

        const exist = await Team.findOne({
            $or: [
                { teamName: request.body.teamName },
                { appCode: request.body.appCode }
            ]
        });

        if (exist) {
            if (exist.teamName === request.body.teamName) {
                return response.status(401).json({ message: 'Team already exists' });
            } else if (exist.appCode === request.body.appCode) {
                return response.status(401).json({ message: 'Appcode already exists' });
            }

        }
        
        else {
            
            const application = {
                ...request.body,
                
            };

            const newApplication = new Team(application);
            await newApplication.save();
            console.log(newApplication);


            response.status(200).json({
                message: 'New team created successfully',
                data: {
                    teamName: application.teamName
                    
                }
            });
        }
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: error });
    }
}

const displayTeam = async (request, response) => {

    try {
        const display = await Team.find();
        response.status(201).json({
            message: "Team data",
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

const deleteTeam= async (req, res) => {

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

const getTeam = async (request, response) => {
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

module.exports = { applicationSignup,displayTeam,getTeam,deleteTeam };
