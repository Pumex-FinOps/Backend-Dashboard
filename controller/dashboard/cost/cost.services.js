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

let costexplorer = new AWS.CostExplorer();

const getCostAndUsage = async (filter) => {
    //console.log("Filter:", filter);

    let params = {
        Granularity: "MONTHLY",
        Metrics: ["UnblendedCost"],
        TimePeriod: {
            End: '2024-05-23', 
            Start: '2024-05-01' 
        }
    };

    if (filter && filter.Filter) {
        params.Filter = filter.Filter;
    }

    try {
        let response = await throttleFixFunction(costexplorer, "getCostAndUsage", params);
        return response;
    } 
    catch (error) {
        console.error("Error in getCostAndUsage:", error);
        throw new Error("Error fetching cost and usage data");
    }
};


module.exports.getCostAndUsage = getCostAndUsage
