const AWS = require('aws-sdk');
require('dotenv').config()
// let AWS_SDK_LOAD_CONFIG=1
AWS.config.update(
    {
        region: process.env.region,
        accessKeyId: process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey

    }
)
console.log(process.env.region);
module.exports = AWS;
