const crypto = require('crypto')
function generatePassword(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') // convert to hexadecimal format
        .slice(0, length); // return required number of characters
}
function generateId(length) {
    const max = Math.pow(10, length) - 1;
    const min = Math.pow(10, length - 1);
    const id = Math.floor(Math.random() * (max - min + 1)) + min;
    return id.toString();
}
function validateFields(reqBody) {
    //console.log("reqBody", reqBody);
    const requiredFields = ['employeeName', 'designation', 'position', 'emailId', 'team'];
    for (const field of requiredFields) {
        if (!reqBody[field] || reqBody[field].trim() === '') {
            return `Field ${field} is required and cannot be empty.`;
        }
    }
    return null;
}
module.exports = { generatePassword, generateId, validateFields }