const AWS = require("../../../config/aws");
const { regionList } = require("../../../config/RegionList");
const ThrottleFixer = require("aws-throttle-fixer");
const TF = new ThrottleFixer();
const tfConfig = {
  retryCount: 24,
  sdkVersion: 2,
  exceptionCodes: ["RequestLimitExceeded"],
  ignoreRetryState: true
};
TF.configure(tfConfig);
const throttleFixFunction = TF.throttleFixer();
var throttle = require('promise-ratelimit')(600); /* rateInMilliseconds */

let dynamodb = new AWS.DynamoDB();
const putItem = async (item) => {
  var params = {
    Item: {
      "employeeName": {
        S: item.employeeName
      },
      "empId": {
        N: item.empId
      },
      "designation": {
        S: item.designation
      },
      "position": {
        S: item.position
      },
      "emailId": {
        S: item.emailId
      },
      "team": {
        S: item.team
      },
      "password": {
        S: item.password
      },
      "image":{
        s:item.image
      },
    },
    TableName: "user"
  };
  try {
    let response = await throttleFixFunction(dynamodb, "putItem", params);
    return response
  }
  catch (error) {
    console.log(error);
    return error
  }
}


module.exports.putItem = putItem