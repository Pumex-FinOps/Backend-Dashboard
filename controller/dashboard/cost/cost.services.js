

const AWS = require("../../../config/aws");
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

let costexplorer = new AWS.CostExplorer();

const getCostAndUsage = async (startDate, endDate, filter) => {
    let params = {
        Granularity: "MONTHLY",
        Metrics: ["UnblendedCost"],
        TimePeriod: {
            Start: startDate,
            End: endDate
        }
    };

    if (filter) {
        params.Filter = filter;
    }

    try {
        let response = await throttleFixFunction(costexplorer, "getCostAndUsage", params);
        return response;
    } catch (error) {
        console.error("Error in getCostAndUsage:", error);
        throw new Error("Error fetching cost and usage data");
    }
};

module.exports.getCostAndUsage = getCostAndUsage;

