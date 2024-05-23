const AWS = require("../../config/aws");
const { regionList } = require("../../config/RegionList");
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

