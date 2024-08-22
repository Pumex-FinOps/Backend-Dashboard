const AWS = require("./aws");
require('dotenv').config()
let stsClient = new AWS.STS();

 async function assumeRoleV2(accountId) {
    try {
        let param = {
            RoleArn: `arn:aws:iam::${accountId}:role/${process.env.Role}`,
            RoleSessionName: 'stsAssumeRoleSession'
        }
        return stsClient.assumeRole(param).promise()
    } catch (e) {
        console.log(e)
        throw e
    }
}
module.exports.assumeRoleV2 = assumeRoleV2