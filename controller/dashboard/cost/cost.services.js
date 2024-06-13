// const AWS = require("../../../config/aws");
// const { regionList } = require("../../../config/RegionList");
// const ThrottleFixer = require("aws-throttle-fixer");
// const TF = new ThrottleFixer();
// const tfConfig = {
//     retryCount: 24,
//     //logger: console.log,
//     sdkVersion: 2,
//     exceptionCodes: ["RequestLimitExceeded"],
//     ignoreRetryState: true
// };
// TF.configure(tfConfig);
// const throttleFixFunction = TF.throttleFixer();
// var throttle = require('promise-ratelimit')(600); /* rateInMilliseconds */

// let costexplorer = new AWS.CostExplorer();

// const getCostAndUsage = async (filter) => {
//     //console.log("Filter:", filter);
//     let today = new Date();

//     // Calculate the first day of the previous month
//     let firstDayOfPreviousMonth = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    
       
//     // Format today's date and the first day of the previous month as YYYY-MM-DD
//     let endDate = today.toISOString().split('T')[0];
//     let startDate = firstDayOfPreviousMonth.toISOString().split('T')[0];
    
//     let params = {
//         Granularity: "MONTHLY",
//         Metrics: ["UnblendedCost"],
//         TimePeriod: {
//             End: endDate,
//             Start: startDate
//         }
//     };

//     if (filter && filter.Filter) {
//         params.Filter = filter.Filter;
//     }

//     try {
//         let response = await throttleFixFunction(costexplorer, "getCostAndUsage", params);
//         return response;
//     } 
//     catch (error) {
//         console.error("Error in getCostAndUsage:", error);
//         throw new Error("Error fetching cost and usage data");
//     }
// };


// module.exports.getCostAndUsage = getCostAndUsage


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

