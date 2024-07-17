
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
//         //console.log("body", req.body);
//         let today = new Date();
//         let CustomstartDate = req?.body?.startDate ? new Date(req.body.startDate) : new Date(today.getFullYear(), 0, 1);
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
//         let ec2YearlyCostResponse = await getCostForResource(["Amazon Elastic Compute Cloud - Compute", "EC2 - Other"], startOfYear, endDate);
//         let ebsYearlyCostResponse = await getCostForResource(["Amazon Elastic Block Store"], startOfYear, endDate);
//         let s3YearlyCostResponse = await getCostForResource(["Amazon Simple Storage Service"], startOfYear, endDate);
//         let lambdaYearlyCostResponse = await getCostForResource(["AWS Lambda"], startOfYear, endDate);  // New Lambda call

//         let ec2CurrentMonthCostResponse = await getCostForResource(["Amazon Elastic Compute Cloud - Compute", "EC2 - Other"], startOfCurrentMonth, endDate);
//         let ebsCurrentMonthCostResponse = await getCostForResource(["Amazon Elastic Block Store"], startOfCurrentMonth, endDate);
//         let s3CurrentMonthCostResponse = await getCostForResource(["Amazon Simple Storage Service"], startOfCurrentMonth, endDate);
//         let lambdaCurrentMonthCostResponse = await getCostForResource(["AWS Lambda"], startOfCurrentMonth, endDate);

//         let ec2CustomPeriodCostResponse = await getCostForResource(["Amazon Elastic Compute Cloud - Compute", "EC2 - Other"], formattedStartDate, formattedEndDate);
//         let ebsCustomPeriodCostResponse = await getCostForResource(["Amazon Elastic Block Store"], formattedStartDate, formattedEndDate);
//         let s3CustomPeriodCostResponse = await getCostForResource(["Amazon Simple Storage Service"], formattedStartDate, formattedEndDate);
//         let lambdaCustomPeriodCostResponse = await getCostForResource(["AWS Lambda"], formattedStartDate, formattedEndDate);  // New Lambda call

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

//         const formattedEc2YearlyCost = sumMonthlyCosts(ec2YearlyCostResponse);
//         const formattedEbsYearlyCost = sumMonthlyCosts(ebsYearlyCostResponse);
//         const formattedS3YearlyCost = sumMonthlyCosts(s3YearlyCostResponse);
//         const formattedLambdaYearlyCost = sumMonthlyCosts(lambdaYearlyCostResponse);  // New Lambda calculation

//         const formattedEc2CurrentMonthCost = sumMonthlyCosts(ec2CurrentMonthCostResponse);
//         const formattedEbsCurrentMonthCost = sumMonthlyCosts(ebsCurrentMonthCostResponse);
//         const formattedS3CurrentMonthCost = sumMonthlyCosts(s3CurrentMonthCostResponse);
//         const formattedLambdaCurrentMonthCost = sumMonthlyCosts(lambdaCurrentMonthCostResponse);  // New Lambda calculation

//         const formattedEc2CustomPeriodCost = sumMonthlyCosts(ec2CustomPeriodCostResponse);
//         const formattedEbsCustomPeriodCost = sumMonthlyCosts(ebsCustomPeriodCostResponse);
//         const formattedS3CustomPeriodCost = sumMonthlyCosts(s3CustomPeriodCostResponse);
//         const formattedLambdaCustomPeriodCost = sumMonthlyCosts(lambdaCustomPeriodCostResponse);  // New Lambda calculation

//         let result = {
//             Yearly: {
//                 TimePeriod: {
//                     Start: startOfYear,
//                     End: formattedEndDate
//                 },
//                 Total: formattedTotalYearlyCost,
//                 EC2: formattedEc2YearlyCost,
//                 EBS: formattedEbsYearlyCost,
//                 S3: formattedS3YearlyCost,
//                 Lambda: formattedLambdaYearlyCost  // Include Lambda in response
//             },
//             CurrentMonth: {
//                 TimePeriod: {
//                     Start: startOfCurrentMonth,
//                     End: formattedEndDate
//                 },
//                 Total: formattedTotalCurrentMonthCost,
//                 EC2: formattedEc2CurrentMonthCost,
//                 EBS: formattedEbsCurrentMonthCost,
//                 S3: formattedS3CurrentMonthCost,
//                 Lambda: formattedLambdaCurrentMonthCost  // Include Lambda in response
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
//                 EC2: formattedEc2CustomPeriodCost,
//                 EBS: formattedEbsCustomPeriodCost,
//                 S3: formattedS3CustomPeriodCost,
//                 Lambda: formattedLambdaCustomPeriodCost  // Include Lambda in response
//             }
//         };
//         console.log("result", result);
//         return result
//         //res.json(result)

//     } catch (error) {
//         console.error("Error in costdetails:", error);
//         //res.status(500).json({ error: "Internal Server Error" });
//     }
// };

// module.exports = { costdetails };


const { getCostAndUsage } = require("./cost.services");

const getCostForResource = async (resources, startDate, endDate) => {
    return await getCostAndUsage(startDate, endDate, {
        Dimensions: {
            Key: "SERVICE",
            Values: resources
        }
    });
};

const costdetails = async (req, res) => {
    try {
        console.log("costdetails.....");
        let today = new Date();
        let CustomstartDate = req?.body?.startDate ? new Date(req.body.startDate) : new Date(today.getFullYear(), 0, 1);
        let CustomendDate = req?.body?.endDate ? new Date(req.body.endDate) : today;

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
        let formattedStartDate = CustomstartDate.toISOString().split('T')[0];
        let formattedEndDate = CustomendDate.toISOString().split('T')[0];

        // Fetch total cost for each period
        let totalYearlyCostResponse = await getCostAndUsage(startOfYear, endDate);
        let totalCurrentMonthCostResponse = await getCostAndUsage(startOfCurrentMonth, endDate);
        let totalPreviousMonthCostResponse = await getCostAndUsage(startOfPreviousMonth, endOfPreviousMonth);
        let totalCustomPeriodCostResponse = await getCostAndUsage(formattedStartDate, formattedEndDate);

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
        let customPeriodCostResponses = await Promise.all(Object.keys(services).map(service =>
            getCostForResource(services[service], formattedStartDate, formattedEndDate)
        ));

        const sumMonthlyCosts = (response) => {
            return response.ResultsByTime.reduce((sum, result) => {
                let monthlyCost = result.Total && result.Total.UnblendedCost ? parseFloat(result.Total.UnblendedCost.Amount) : 0;
                return sum + monthlyCost;
            }, 0);
        };

        const formattedTotalYearlyCost = sumMonthlyCosts(totalYearlyCostResponse);
        const formattedTotalCurrentMonthCost = sumMonthlyCosts(totalCurrentMonthCostResponse);
        const formattedTotalPreviousMonthCost = sumMonthlyCosts(totalPreviousMonthCostResponse);
        const formattedTotalCustomPeriodCost = sumMonthlyCosts(totalCustomPeriodCostResponse);

        let formattedYearlyCosts = {};
        let formattedCurrentMonthCosts = {};
        let formattedCustomPeriodCosts = {};

        Object.keys(services).forEach((service, index) => {
            formattedYearlyCosts[service] = sumMonthlyCosts(yearlyCostResponses[index]);
            formattedCurrentMonthCosts[service] = sumMonthlyCosts(currentMonthCostResponses[index]);
            formattedCustomPeriodCosts[service] = sumMonthlyCosts(customPeriodCostResponses[index]);
        });

        let result = {
            Yearly: {
                TimePeriod: {
                    Start: startOfYear,
                    End: formattedEndDate
                },
                Total: formattedTotalYearlyCost,
                ...formattedYearlyCosts
            },
            CurrentMonth: {
                TimePeriod: {
                    Start: startOfCurrentMonth,
                    End: formattedEndDate
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
            },
            CustomPeriod: {
                TimePeriod: {
                    Start: formattedStartDate,
                    End: formattedEndDate
                },
                Total: formattedTotalCustomPeriodCost,
                ...formattedCustomPeriodCosts
            }
        };

        console.log("result", result);
        return result;
        //res.json(result)

    } catch (error) {
        console.error("Error in costdetails:", error);
        //res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { costdetails };
