const { generateId, generatePassword, validateFields } = require("./Utiles")
const {
    putItem
} = require("./User.service")
const login = async(req, res)=>{
    
}
const addNewUser = async (req, res) => {
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
        const password = generatePassword(5);
        const empId = generateId(4)
        console.log(req.body);
        let item = {
            employeeName: req.body.employeeName,
            empId: empId,
            designation: req.body.designation,
            position: req.body.position,
            emailId: req.body.emailId,
            team: req.body.team,
            password: password
        }

        let response = await putItem(item);
        //console.log("response", response);
        if (Object.keys(response).length === 0) {
            res.status(201).json({
                success: true,
                message: 'User added successfully',
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
            message: 'Error adding user',
            error: err.message // Send error message back in the response
        });
    }


}

module.exports.addNewUser = addNewUser