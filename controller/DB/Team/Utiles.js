const crypto = require('crypto')

function validateFields(reqBody) {
    console.log("reqBody", reqBody);
    const requiredFields = ['appCode', 'appOwner', 'costCenter', 'newTag', 'projectManager','supportEmail','teamName'];
    for (const field of requiredFields) {
        if (!reqBody[field] || reqBody[field].trim() === '') {
            return `Field ${field} is required and cannot be empty.`;
        }
    }
    return null;
}
module.exports.validateFields =validateFields 