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
var throttle = require('promise-ratelimit')(600); / rateInMilliseconds /

let dynamodb = new AWS.DynamoDB();
const putItem = async (item) => {
  var params = {
    Item: {
      "appCode": {
        S: item.appCode
      },
      "appOwner": {
        S: item.appOwner
      },
      "costCenter": {
        S: item.costCenter
      },
      "newTag": {
        S: item.newTag
      },
      "projectManager": {
        S: item.projectManager
      },
      "supportEmail": {
        S: item.supportEmail
      },
      "teamName": {
        S: item.teamName
      },
    },
    TableName: "ApplicationTeam"
  };
  try {
    let response = await throttleFixFunction(dynamodb, "putItem", params);
    return response
  } catch (error) {
    console.log(error);
  }
}


module.exports.putItem = putItem