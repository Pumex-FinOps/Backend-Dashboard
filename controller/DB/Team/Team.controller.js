const {putItem} = require('./Team.service')
const {validateFields}=require("./Utiles")
const addApplicationTeam = async(req,res)=>{
    try {
        //console.log(req.body);
        const validationError = validateFields(req.body);
        //console.log("validationError", validationError);
        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError
            });
        }
       
  
        console.log(req.body);
        let item = {
            appCode: req.body.appCode,
            appOwner: req.body.appOwner,
            costCenter: req.body.costCenter,
            newTag: req.body.newTag,
            projectManager: req.body.projectManager,
            supportEmail: req.body.supportEmail,
            teamName: req.body.teamName
        }

        let response = await putItem(item);
        //console.log("response", response);
        if (Object.keys(response).length === 0) {
            res.status(201).json({
                success: true,
                message: 'New Team added successfully',
                data: item // Send the added item back in the response
            });
        }
        else {
            // Handle unexpected successful response structure
            res.status(500).json({
                success: false,
                message: 'Unexpected response from database',
                data: response
            });
        }

    }
    catch (err) {

        console.error("Unable to add item. Error JSON:", JSON.stringify(err,));
        res.status(500).json({
            success: false,
            message: 'Error adding Team',
            error: err.message // Send error message back in the response
        });
    }



}
module.exports.addApplicationTeam = addApplicationTeam