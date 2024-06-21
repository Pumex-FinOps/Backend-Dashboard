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

module.exports = { applicationSignup };
