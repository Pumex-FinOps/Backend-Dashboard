

// const { getCostAndUsage } = require('./cost.services');

// const getCostForResource = async (resources, startDate, endDate) => {
//   try {
//     return await getCostAndUsage(startDate, endDate, {
//       Dimensions: {
//         Key: "SERVICE",
//         Values: resources
//       }
//     });
//   } catch (error) {
//     console.error(`Error fetching cost for resource: ${resources}`, error);
//     return { ResultsByTime: [] }; 
//   }
// };

// const sumMonthlyCosts = (response) => {
//   if (!response || !response.ResultsByTime) {
//     console.warn('Response or ResultsByTime is undefined:', response);
//     return 0;
//   }

//   return response.ResultsByTime.reduce((sum, result) => {
//     let monthlyCost = result.Total && result.Total.UnblendedCost ? parseFloat(result.Total.UnblendedCost.Amount) : 0;
//     return sum + monthlyCost;
//   }, 0);
// };

// const costdetails = async (req, res) => {
//   try {
//     console.log("Fetching cost details...");
//     let today = new Date();

//     // Calculate date ranges

//     let firstDayOfCurrentYear = new Date(today.getFullYear(), 0, 1);
//     let firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//     let firstDayOfPreviousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
//     let lastDayOfPreviousMonth = new Date(today.getFullYear(), today.getMonth(), 0);

//     // Format dates as YYYY-MM-DD
//     let startOfYear = firstDayOfCurrentYear.toISOString().split('T')[0];
//     let startOfCurrentMonth = firstDayOfCurrentMonth.toISOString().split('T')[0];
//     let startOfPreviousMonth = firstDayOfPreviousMonth.toISOString().split('T')[0];
//     let endOfPreviousMonth = lastDayOfPreviousMonth.toISOString().split('T')[0];
//     let endDate = today.toISOString().split('T')[0];

//     // Fetch total cost for each period
//     let totalYearlyCostResponse = await getCostAndUsage(startOfYear, endDate);
//     let totalCurrentMonthCostResponse = await getCostAndUsage(startOfCurrentMonth, endDate);
//     let totalPreviousMonthCostResponse = await getCostAndUsage(startOfPreviousMonth, endOfPreviousMonth);

//     // Validate and format total costs
//     const formattedTotalYearlyCost = sumMonthlyCosts(totalYearlyCostResponse);
//     const formattedTotalCurrentMonthCost = sumMonthlyCosts(totalCurrentMonthCostResponse);
//     const formattedTotalPreviousMonthCost = sumMonthlyCosts(totalPreviousMonthCostResponse);

//     // Define service-specific resource mapping
//     let services = {
//       EC2: ["Amazon Elastic Compute Cloud - Compute", "EC2 - Other"],
//       EBS: ["Amazon Elastic Block Store"],
//       S3: ["Amazon Simple Storage Service"],
//       Lambda: ["AWS Lambda"],
//       RDS: ["Amazon RDS Service"],
//       CloudWatch: ["AmazonCloudWatch"],
//       CostExplorer: ["AWS Cost Explorer"],
//       ELB: ["AWSELB"],
//       DynamoDB: ["Amazon DynamoDB"],
//       Beanstalk: ["AWS Elastic Beanstalk"],
//       CodeCommit: ["AWS CodeCommit"],
//       CodeBuild: ["AWS CodeBuild"],
//       CodePipeline: ["AWS CodePipeline"]
//     };

//     // Fetch resource-specific costs for each period
//     let yearlyCostResponses = await Promise.all(Object.keys(services).map(service =>
//       getCostForResource(services[service], startOfYear, endDate)
//     ));
//     let currentMonthCostResponses = await Promise.all(Object.keys(services).map(service =>
//       getCostForResource(services[service], startOfCurrentMonth, endDate)
//     ));

//     let formattedYearlyCosts = {};
//     let formattedCurrentMonthCosts = {};

//     Object.keys(services).forEach((service, index) => {
//       formattedYearlyCosts[service] = sumMonthlyCosts(yearlyCostResponses[index]);
//       formattedCurrentMonthCosts[service] = sumMonthlyCosts(currentMonthCostResponses[index]);
//     });

//     let result = {
//       Yearly: {
//         TimePeriod: {
//           Start: startOfYear,
//           End: endDate
//         },
//         Total: formattedTotalYearlyCost,
//         ...formattedYearlyCosts
//       },
//       CurrentMonth: {
//         TimePeriod: {
//           Start: startOfCurrentMonth,
//           End: endDate
//         },
//         Total: formattedTotalCurrentMonthCost,
//         ...formattedCurrentMonthCosts
//       },
//       PreviousMonth: {
//         TimePeriod: {
//           Start: startOfPreviousMonth,
//           End: endOfPreviousMonth
//         },
//         Total: formattedTotalPreviousMonthCost
//       }
//     };

//     console.log("Cost details:", result);
//     return result;

//   } catch (error) {
//     console.error("Error in costdetails:", error);
//     return error

//   }
// };

// // Fetch cost details for custom period
// const customCostDetails = async (req, res) => {
//   try {
//     console.log("Fetching custom range cost details...");
//     if (!req.body.startDate || !req.body.endDate) {
//       return res.status(400).json({ error: "startDate and endDate are required" });
//     }

//     let startDate = new Date(req.body.startDate);
//     let endDate = new Date(req.body.endDate);

//     // Ensure end date is after start date
//     if (startDate > endDate) {
//       return res.status(400).json({ error: "startDate must be before endDate" });
//     }

//     let formattedStartDate = startDate.toISOString().split('T')[0];
//     let formattedEndDate = endDate.toISOString().split('T')[0];

//     let totalCustomPeriodCostResponse = await getCostAndUsage(formattedStartDate, formattedEndDate);

//     let services = {
//       EC2: ["Amazon Elastic Compute Cloud - Compute", "EC2 - Other"],
//       EBS: ["Amazon Elastic Block Store"],
//       S3: ["Amazon Simple Storage Service"],
//       Lambda: ["AWS Lambda"],
//       RDS: ["Amazon RDS Service"],
//       CloudWatch: ["AmazonCloudWatch"],
//       CostExplorer: ["AWS Cost Explorer"],
//       ELB: ["AWSELB"],
//       DynamoDB: ["Amazon DynamoDB"],
//       Beanstalk: ["AWS Elastic Beanstalk"],
//       CodeCommit: ["AWS CodeCommit"],
//       CodeBuild: ["AWS CodeBuild"],
//       CodePipeline: ["AWS CodePipeline"]
//     };

//     let customPeriodCostResponses = await Promise.all(Object.keys(services).map(service =>
//       getCostForResource(services[service], formattedStartDate, formattedEndDate)
//     ));

//     const formattedTotalCustomPeriodCost = sumMonthlyCosts(totalCustomPeriodCostResponse);

//     let formattedCustomPeriodCosts = {};

//     Object.keys(services).forEach((service, index) => {
//       formattedCustomPeriodCosts[service] = sumMonthlyCosts(customPeriodCostResponses[index]);
//     });

//     let result = {
//       CustomPeriod: {
//         TimePeriod: {
//           Start: formattedStartDate,
//           End: formattedEndDate
//         },
//         Total: formattedTotalCustomPeriodCost,
//         ...formattedCustomPeriodCosts
//       }
//     };

//     console.log("Custom range cost details:", result);
//     res.json(result);

//   } catch (error) {
//     console.error("Error in customCostDetails:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// module.exports = { costdetails, customCostDetails };




const { getCostAndUsage } = require('./cost.services');
const { assumeRoleV2 } = require('../../../config/assumeRole');
const AWS = require('../../../config/aws');

const accountIds = process.env.ACCOUNT_IDS.split(',');

const getCostForResource = async (resources, startDate, endDate, credentials) => {
    try {
        return await getCostAndUsage(startDate, endDate, {
            Dimensions: {
                Key: "SERVICE",
                Values: resources
            }
        }, credentials);
    } catch (error) {
        console.error(`Error fetching cost for resource: ${resources}`, error);
        return { ResultsByTime: [] };
    }
};

const sumMonthlyCosts = (response) => {
    if (!response || !response.ResultsByTime) {
        console.warn('Response or ResultsByTime is undefined:', response);
        return 0;
    }

    return response.ResultsByTime.reduce((sum, result) => {
        let monthlyCost = result.Total && result.Total.UnblendedCost ? parseFloat(result.Total.UnblendedCost.Amount) : 0;
        return sum + monthlyCost;
    }, 0);
};

const calculateTotalCosts = (costs) => {
    return Object.values(costs).reduce((total, cost) => total + cost, 0);
};

const fetchCosts = async (startDate, endDate, services, credentials) => {
    let costResponses = await Promise.all(Object.keys(services).map(service =>
        getCostForResource(services[service], startDate, endDate, credentials)
    ));
    
    let formattedCosts = {};
    Object.keys(services).forEach((service, index) => {
        formattedCosts[service] = sumMonthlyCosts(costResponses[index]);
    });
    
    return {
        ...formattedCosts,
        Total: calculateTotalCosts(formattedCosts)
    };
};

const costdetails = async (req, res) => {
    try {
        console.log("Fetching cost details...");
        let today = new Date();

        // Calculate date ranges
        let firstDayOfCurrentYear = new Date(today.getFullYear(), 0, 1);
        let firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // Format dates as YYYY-MM-DD
        let startOfYear = firstDayOfCurrentYear.toISOString().split('T')[0];
        let startOfCurrentMonth = firstDayOfCurrentMonth.toISOString().split('T')[0];
        let endDate = today.toISOString().split('T')[0];

        // Define service-specific resource mapping
        let services = {
            EC2: ["Amazon Elastic Compute Cloud - Compute", "EC2 - Other"],
            EBS: ["Amazon Elastic Block Store"],
            S3: ["Amazon Simple Storage Service"],
            // Lambda: ["AWS Lambda"],
            // RDS: ["Amazon RDS Service"],
            // CloudWatch: ["AmazonCloudWatch"],
            CostExplorer: ["AWS Cost Explorer"]
            // ELB: ["AWSELB"],
            // DynamoDB: ["Amazon DynamoDB"],
            // Beanstalk: ["AWS Elastic Beanstalk"],
            // CodeCommit: ["AWS CodeCommit"],
            // CodeBuild: ["AWS CodeBuild"],
            // CodePipeline: ["AWS CodePipeline"]
        };

        let allAccountsCostData = {};
        
        for (const accountId of accountIds) {
            console.log(`Processing account: ${accountId}`);

            let credentials = await assumeRoleV2(accountId);
            let accessKeyId = credentials.Credentials.AccessKeyId;
            let secretAccessKey = credentials.Credentials.SecretAccessKey;
            let sessionToken = credentials.Credentials.SessionToken;
            let awsCredentials = new AWS.Credentials(accessKeyId, secretAccessKey, sessionToken);

            // Fetch yearly costs
            let yearlyCosts = await fetchCosts(startOfYear, endDate, services, awsCredentials);

            // Fetch current month costs
            let currentMonthCosts = await fetchCosts(startOfCurrentMonth, endDate, services, awsCredentials);

            allAccountsCostData[accountId] = {
                Yearly: {
                    TimePeriod: {
                        Start: startOfYear,
                        End: endDate
                    },
                    ...yearlyCosts
                },
                CurrentMonth: {
                    TimePeriod: {
                        Start: startOfCurrentMonth,
                        End: endDate
                    },
                    ...currentMonthCosts
                }
            };
        }

        let result = {
            
                AllAccounts: allAccountsCostData
            }
            // CurrentMonth: {
            //     TimePeriod: {
            //         Start: startOfCurrentMonth,
            //         End: endDate
            //     },
            //     AllAccounts: allAccountsCostData
            // }
        

        console.log("Cost details:", result);
        res.json(result);

    } catch (error) {
        console.error("Error in costdetails:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// Fetch cost details for custom period
const customCostDetails = async (req, res) => {
    try {
        console.log("Fetching custom range cost details...");
        if (!req.body.startDate || !req.body.endDate) {
            return res.status(400).json({ error: "startDate and endDate are required" });
        }

        let startDate = new Date(req.body.startDate);
        let endDate = new Date(req.body.endDate);

        // Ensure end date is after start date
        if (startDate > endDate) {
            return res.status(400).json({ error: "startDate must be before endDate" });
        }

        let formattedStartDate = startDate.toISOString().split('T')[0];
        let formattedEndDate = endDate.toISOString().split('T')[0];

        let allAccountsCustomPeriodCostData = {};
        
        for (const accountId of accountIds) {
            console.log(`Processing account: ${accountId}`);

            let credentials = await assumeRoleV2(accountId);
            let accessKeyId = credentials.Credentials.AccessKeyId;
            let secretAccessKey = credentials.Credentials.SecretAccessKey;
            let sessionToken = credentials.Credentials.SessionToken;
            let awsCredentials = new AWS.Credentials(accessKeyId, secretAccessKey, sessionToken);

            let totalCustomPeriodCostResponse = await getCostAndUsage(formattedStartDate, formattedEndDate, null, awsCredentials);
            let customPeriodCostResponses = await Promise.all(Object.keys(services).map(service =>
                getCostForResource(services[service], formattedStartDate, formattedEndDate, awsCredentials)
            ));

            const formattedTotalCustomPeriodCost = sumMonthlyCosts(totalCustomPeriodCostResponse);

            let formattedCustomPeriodCosts = {};
            Object.keys(services).forEach((service, index) => {
                formattedCustomPeriodCosts[service] = sumMonthlyCosts(customPeriodCostResponses[index]);
            });

            let customPeriodTotal = calculateTotalCosts(formattedCustomPeriodCosts);

            allAccountsCustomPeriodCostData[accountId] = {
                CustomPeriod: {
                    TimePeriod: {
                        Start: formattedStartDate,
                        End: formattedEndDate
                    },
                    Total: customPeriodTotal,
                    ...formattedCustomPeriodCosts
                }
            };
        }

        let result = {
            CustomPeriod: {
                TimePeriod: {
                    Start: formattedStartDate,
                    End: formattedEndDate
                },
                AllAccounts: allAccountsCustomPeriodCostData
            }
        };

        console.log("Custom range cost details:", result);
        res.json(result);

    } catch (error) {
        console.error("Error in customCostDetails:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { costdetails, customCostDetails };

