


// const { getCostAndUsage } = require("./cost.services");

// const getCostForResource = async (resources, startDate, endDate) => {
//     return await getCostAndUsage(startDate, endDate, {
//         Dimensions: {
//             Key: "SERVICE",
//             Values: resources
//         }
//     });
// };

// const costdetails = async (req, res) => {
//     try {
//         console.log("costdetails.....");
//         let today = new Date();
//          let CustomstartDate = req?.body?.startDate ? new Date(req.body.startDate) : new Date(today.getFullYear(), 0, 1);
//         let CustomendDate = req?.body?.endDate ? new Date(req.body.endDate) : today;

//         // Calculate date ranges
//         let firstDayOfCurrentYear = new Date(today.getFullYear(), 0, 1);
//         let firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//         let firstDayOfPreviousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
//         let lastDayOfPreviousMonth = new Date(today.getFullYear(), today.getMonth(), 0);

//         // Format dates as YYYY-MM-DD
//         let startOfYear = firstDayOfCurrentYear.toISOString().split('T')[0];
//         let startOfCurrentMonth = firstDayOfCurrentMonth.toISOString().split('T')[0];
//         let startOfPreviousMonth = firstDayOfPreviousMonth.toISOString().split('T')[0];
//         let endOfPreviousMonth = lastDayOfPreviousMonth.toISOString().split('T')[0];
//         let endDate = today.toISOString().split('T')[0];
//         let formattedStartDate = CustomstartDate.toISOString().split('T')[0];
//         let formattedEndDate = CustomendDate.toISOString().split('T')[0];

//         // Fetch total cost for each period
//         let totalYearlyCostResponse = await getCostAndUsage(startOfYear, endDate);
//         let totalCurrentMonthCostResponse = await getCostAndUsage(startOfCurrentMonth, endDate);
//         let totalPreviousMonthCostResponse = await getCostAndUsage(startOfPreviousMonth, endOfPreviousMonth);
//         let totalCustomPeriodCostResponse = await getCostAndUsage(formattedStartDate, formattedEndDate);

//         // Fetch resource-specific costs for each period
//         let services = {
//             EC2: ["Amazon Elastic Compute Cloud - Compute", "EC2 - Other"],
//             EBS: ["Amazon Elastic Block Store"],
//             S3: ["Amazon Simple Storage Service"],
//             Lambda: ["AWS Lambda"],
//             RDS: ["Amazon RDS Service"],
//             CloudWatch: ["AmazonCloudWatch"],
//             CostExplorer: ["AWS Cost Explorer"],
//             ELB: ["AWSELB"],
//             DynamoDB: ["Amazon DynamoDB"],
//             Beanstalk: ["AWS Elastic Beanstalk"],
//             CodeCommit: ["AWS CodeCommit"],
//             CodeBuild: ["AWS CodeBuild"],
//             CodePipeline: ["AWS CodePipeline"]
//         };

//         let yearlyCostResponses = await Promise.all(Object.keys(services).map(service =>
//             getCostForResource(services[service], startOfYear, endDate)
//         ));
//         let currentMonthCostResponses = await Promise.all(Object.keys(services).map(service =>
//             getCostForResource(services[service], startOfCurrentMonth, endDate)
//         ));
//         let customPeriodCostResponses = await Promise.all(Object.keys(services).map(service =>
//             getCostForResource(services[service], formattedStartDate, formattedEndDate)
//         ));

//         const sumMonthlyCosts = (response) => {
//             return response.ResultsByTime.reduce((sum, result) => {
//                 let monthlyCost = result.Total && result.Total.UnblendedCost ? parseFloat(result.Total.UnblendedCost.Amount) : 0;
//                 return sum + monthlyCost;
//             }, 0);
//         };

//         const formattedTotalYearlyCost = sumMonthlyCosts(totalYearlyCostResponse);
//         const formattedTotalCurrentMonthCost = sumMonthlyCosts(totalCurrentMonthCostResponse);
//         const formattedTotalPreviousMonthCost = sumMonthlyCosts(totalPreviousMonthCostResponse);
//         const formattedTotalCustomPeriodCost = sumMonthlyCosts(totalCustomPeriodCostResponse);

//         let formattedYearlyCosts = {};
//         let formattedCurrentMonthCosts = {};
//         let formattedCustomPeriodCosts = {};

//         Object.keys(services).forEach((service, index) => {
//             formattedYearlyCosts[service] = sumMonthlyCosts(yearlyCostResponses[index]);
//             formattedCurrentMonthCosts[service] = sumMonthlyCosts(currentMonthCostResponses[index]);
//             formattedCustomPeriodCosts[service] = sumMonthlyCosts(customPeriodCostResponses[index]);
//         });

//         let result = {
//             Yearly: {
//                 TimePeriod: {
//                     Start: startOfYear,
//                     End: formattedEndDate
//                 },
//                 Total: formattedTotalYearlyCost,
//                 ...formattedYearlyCosts
//             },
//             CurrentMonth: {
//                 TimePeriod: {
//                     Start: startOfCurrentMonth,
//                     End: formattedEndDate
//                 },
//                 Total: formattedTotalCurrentMonthCost,
//                 ...formattedCurrentMonthCosts
//             },
//             PreviousMonth: {
//                 TimePeriod: {
//                     Start: startOfPreviousMonth,
//                     End: endOfPreviousMonth
//                 },
//                 Total: formattedTotalPreviousMonthCost
//             },
//             CustomPeriod: {
//                 TimePeriod: {
//                     Start: formattedStartDate,
//                     End: formattedEndDate
//                 },
//                 Total: formattedTotalCustomPeriodCost,
//                 ...formattedCustomPeriodCosts
//             }
//         };

//         console.log("result", result);
//         return result;
//         //res.json(result)

//     } catch (error) {
//         console.error("Error in costdetails:", error);
//         //res.status(500).json({ error: "Internal Server Error" });
//     }
// };

// module.exports = { costdetails };


const { getCostAndUsage } = require('./cost.services');

const getCostForResource = async (resources, startDate, endDate) => {
  return await getCostAndUsage(startDate, endDate, {
    Dimensions: {
      Key: "SERVICE",
      Values: resources
    }
  });
};

const sumMonthlyCosts = (response) => {
  return response.ResultsByTime.reduce((sum, result) => {
    let monthlyCost = result.Total && result.Total.UnblendedCost ? parseFloat(result.Total.UnblendedCost.Amount) : 0;
    return sum + monthlyCost;
  }, 0);
};

// Fetch cost details for predefined periods
const costdetails = async (req, res) => {
  try {
    console.log("Fetching cost details...");
    let today = new Date();

    // Calculate date ranges
    let firstDayOfCurrentYear = new Date(today.getFullYear(), 0, 1);
    let firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    let firstDayOfPreviousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    let lastDayOfPreviousMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    // Format dates as YYYY-MM-DD
    let startOfYear = firstDayOfCurrentYear.toISOString().split('T')[0];
    let startOfCurrentMonth = firstDayOfCurrentMonth.toISOString().split('T')[0];
    let startOfPreviousMonth = firstDayOfPreviousMonth.toISOString().split('T')[0];
    let endOfPreviousMonth = lastDayOfPreviousMonth.toISOString().split('T')[0];
    let endDate = today.toISOString().split('T')[0];

    // Fetch total cost for each period
    let totalYearlyCostResponse = await getCostAndUsage(startOfYear, endDate);
    let totalCurrentMonthCostResponse = await getCostAndUsage(startOfCurrentMonth, endDate);
    let totalPreviousMonthCostResponse = await getCostAndUsage(startOfPreviousMonth, endOfPreviousMonth);

    // Fetch resource-specific costs for each period
    let services = {
      EC2: ["Amazon Elastic Compute Cloud - Compute", "EC2 - Other"],
      EBS: ["Amazon Elastic Block Store"],
      S3: ["Amazon Simple Storage Service"],
      Lambda: ["AWS Lambda"],
      RDS: ["Amazon RDS Service"],
      CloudWatch: ["AmazonCloudWatch"],
      CostExplorer: ["AWS Cost Explorer"],
      ELB: ["AWSELB"],
      DynamoDB: ["Amazon DynamoDB"],
      Beanstalk: ["AWS Elastic Beanstalk"],
      CodeCommit: ["AWS CodeCommit"],
      CodeBuild: ["AWS CodeBuild"],
      CodePipeline: ["AWS CodePipeline"]
    };

    let yearlyCostResponses = await Promise.all(Object.keys(services).map(service =>
      getCostForResource(services[service], startOfYear, endDate)
    ));
    let currentMonthCostResponses = await Promise.all(Object.keys(services).map(service =>
      getCostForResource(services[service], startOfCurrentMonth, endDate)
    ));

    const formattedTotalYearlyCost = sumMonthlyCosts(totalYearlyCostResponse);
    const formattedTotalCurrentMonthCost = sumMonthlyCosts(totalCurrentMonthCostResponse);
    const formattedTotalPreviousMonthCost = sumMonthlyCosts(totalPreviousMonthCostResponse);

    let formattedYearlyCosts = {};
    let formattedCurrentMonthCosts = {};

    Object.keys(services).forEach((service, index) => {
      formattedYearlyCosts[service] = sumMonthlyCosts(yearlyCostResponses[index]);
      formattedCurrentMonthCosts[service] = sumMonthlyCosts(currentMonthCostResponses[index]);
    });

    let result = {
      Yearly: {
        TimePeriod: {
          Start: startOfYear,
          End: endDate
        },
        Total: formattedTotalYearlyCost,
        ...formattedYearlyCosts
      },
      CurrentMonth: {
        TimePeriod: {
          Start: startOfCurrentMonth,
          End: endDate
        },
        Total: formattedTotalCurrentMonthCost,
        ...formattedCurrentMonthCosts
      },
      PreviousMonth: {
        TimePeriod: {
          Start: startOfPreviousMonth,
          End: endOfPreviousMonth
        },
        Total: formattedTotalPreviousMonthCost
      }
    };

    console.log("Cost details:", result);
    return result;

  } catch (error) {
    console.error("Error in costdetails:", error);
    return error

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

    let totalCustomPeriodCostResponse = await getCostAndUsage(formattedStartDate, formattedEndDate);

    let services = {
      EC2: ["Amazon Elastic Compute Cloud - Compute", "EC2 - Other"],
      EBS: ["Amazon Elastic Block Store"],
      S3: ["Amazon Simple Storage Service"],
      Lambda: ["AWS Lambda"],
      RDS: ["Amazon RDS Service"],
      CloudWatch: ["AmazonCloudWatch"],
      CostExplorer: ["AWS Cost Explorer"],
      ELB: ["AWSELB"],
      DynamoDB: ["Amazon DynamoDB"],
      Beanstalk: ["AWS Elastic Beanstalk"],
      CodeCommit: ["AWS CodeCommit"],
      CodeBuild: ["AWS CodeBuild"],
      CodePipeline: ["AWS CodePipeline"]
    };

    let customPeriodCostResponses = await Promise.all(Object.keys(services).map(service =>
      getCostForResource(services[service], formattedStartDate, formattedEndDate)
    ));

    const formattedTotalCustomPeriodCost = sumMonthlyCosts(totalCustomPeriodCostResponse);

    let formattedCustomPeriodCosts = {};

    Object.keys(services).forEach((service, index) => {
      formattedCustomPeriodCosts[service] = sumMonthlyCosts(customPeriodCostResponses[index]);
    });

    let result = {
      CustomPeriod: {
        TimePeriod: {
          Start: formattedStartDate,
          End: formattedEndDate
        },
        Total: formattedTotalCustomPeriodCost,
        ...formattedCustomPeriodCosts
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
