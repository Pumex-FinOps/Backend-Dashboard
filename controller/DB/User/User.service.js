const AWS = require("../../../config/aws");
const { regionList } = require("../../../config/RegionList");
const ThrottleFixer = require("aws-throttle-fixer");
const TF = new ThrottleFixer();
const tfConfig = {
    retryCount: 24,
    //logger: console.log,
    sdkVersion: 2,
    exceptionCodes: ["RequestLimitExceeded"],
    ignoreRetryState: true
};
TF.configure(tfConfig);
const throttleFixFunction = TF.throttleFixer();
var throttle = require('promise-ratelimit')(600); /* rateInMilliseconds */

let  dynamodb = new AWS.DynamoDB();
const createTable = async()=>{
    var params = {
        AttributeDefinitions: [
           {
          AttributeName: "Artist", 
          AttributeType: "S"
         }, 
           {
          AttributeName: "SongTitle", 
          AttributeType: "S"
         }
        ], 
        KeySchema: [
           {
          AttributeName: "Artist", 
          KeyType: "HASH"
         }, 
           {
          AttributeName: "SongTitle", 
          KeyType: "RANGE"
         }
        ], 
        ProvisionedThroughput: {
         ReadCapacityUnits: 5, 
         WriteCapacityUnits: 5
        }, 
        TableName: "Music"
       };
     let response = await  dynamodb.createTable(params)
     console.log(response);

}

