const bcrypt = require('bcrypt');
const Team = require('../model/applicationSchema');
const User = require('../model/userSchema');

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
                return response.status(401).json({ message: 'TeamName  already exists' });
            } else if (exist.appCode === request.body.appCode) {
                return response.status(401).json({ message: 'Appcode already exists' });
            }
        } else {
            const { memberIds } = request.body;

            await Team.updateMany(
                { teamMembers: { $in: memberIds } },
                { $pull: { teamMembers: { $in: memberIds } } }
            );

            const application = {
                ...request.body,
                teamMembers: memberIds
            };

            const newApplication = new Team(application);
            await newApplication.save();
            console.log(newApplication);

            await User.updateMany(
                { _id: { $in: memberIds } },
                { $set: { teamId: newApplication._id } }
            );

            response.status(200).json({
                message: 'New team created successfully',
                data: {
                    teamName: application.teamName
                }
            });
        }
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: error.message });
    }
};


const displayTeam = async (request, response) => {

    try {
        const display = await Team.find().populate('appOwners', 'name email')
            .populate('projectManager', 'name email')
            .populate('teamMembers', 'name email');
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

const deleteTeam = async (request, response) => {
    try {
        const { _id } = request.params;
        //console.log("teamId", _id);
        const team = await Team.findById(_id);
        if (!team) {
            return response.status(404).json({ message: 'Team not found' });
        }

        const memberIds = team.teamMembers;

        await Team.findByIdAndDelete(_id);

        await User.updateMany(
            { _id: { $in: memberIds } },
            { $set: { team: null } }
        );

        response.status(200).json({
            message: 'Team deleted successfully'
        });
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: error.message });
    }
};

const getTeam = async (request, response) => {
    console.log("request.params._id", request.params._id);
    try {
        const display = await Team.findOne({ _id: request.params._id }).populate(
            "teamMembers").populate('appOwners', 'name email')
            .populate('projectManager', 'name email')
        // console.log(request.params._id)

        if (display) {
            response.status(200).json({
                data:
                    { data: display }
            });
        } else {
            response.status(404).json({ message: 'team not found' });
        }
    } catch (error) {

        console.error(error);
        response.status(500).json({ message: 'Error while fetching team' });
    }
}
const updateTeam = async (request, response) => {
    try {
        const { _id } = request.params;
        const { teamMembers, addMembers, removeMembers } = request.body;

        // Find the team to update
        const team = await Team.findById(_id);
        if (!team) {
            return response.status(404).json({ message: 'Team not found' });
        }

        // Check for duplicate team names or app codes if being updated
        if (request.body.teamName || request.body.appCode) {
            const existingTeam = await Team.findOne({
                $or: [
                    { teamName: request.body.teamName },
                    { appCode: request.body.appCode }
                ],
                _id: { $ne: _id }
            });

            if (existingTeam) {
                if (existingTeam.teamName === request.body.teamName) {
                    return response.status(400).json({ message: 'Team name already exists' });
                } else if (existingTeam.appCode === request.body.appCode) {
                    return response.status(400).json({ message: 'App code already exists' });
                }
            }
        }

        // Handle removing members from the team
        if (removeMembers && removeMembers.length > 0) {
            await Team.updateOne(
                { _id },
                { $pull: { teamMembers: { $in: removeMembers } } }
            );

            await User.updateMany(
                { _id: { $in: removeMembers } },
                { $set: { team: null } }
            );
        }

        // Handle adding new members to the team
        if (addMembers && addMembers.length > 0) {
            await User.updateMany(
                { _id: { $in: addMembers } },
                { $set: { team: _id } }
            );

            await Team.updateOne(
                { _id },
                { $addToSet: { teamMembers: { $each: addMembers } } }
            );
        }

        // Update other team details if necessary
        const updatedTeam = await Team.findByIdAndUpdate(_id, request.body, { new: true });

        response.status(200).json({
            message: 'Team updated successfully',
            data: updatedTeam
        });
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: error.message });
    }
};

module.exports = { applicationSignup, displayTeam, getTeam, deleteTeam, updateTeam }