
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
        let ec2YearlyCostResponse = await getCostForResource(["Amazon Elastic Compute Cloud - Compute", "EC2 - Other"], startOfYear, endDate);
        let ebsYearlyCostResponse = await getCostForResource(["Amazon Elastic Block Store"], startOfYear, endDate);
        let s3YearlyCostResponse = await getCostForResource(["Amazon Simple Storage Service"], startOfYear, endDate);

        let ec2CurrentMonthCostResponse = await getCostForResource(["Amazon Elastic Compute Cloud - Compute", "EC2 - Other"], startOfCurrentMonth, endDate);
        let ebsCurrentMonthCostResponse = await getCostForResource(["Amazon Elastic Block Store"], startOfCurrentMonth, endDate);
        let s3CurrentMonthCostResponse = await getCostForResource(["Amazon Simple Storage Service"], startOfCurrentMonth, endDate);

        const sumMonthlyCosts = (response) => {
            return response.ResultsByTime.reduce((sum, result) => {
                let monthlyCost = result.Total && result.Total.UnblendedCost ? parseFloat(result.Total.UnblendedCost.Amount) : 0;
                return sum + monthlyCost;
            }, 0);
        };

        const formattedTotalYearlyCost = sumMonthlyCosts(totalYearlyCostResponse);
        const formattedTotalCurrentMonthCost = sumMonthlyCosts(totalCurrentMonthCostResponse);
        const formattedTotalPreviousMonthCost = sumMonthlyCosts(totalPreviousMonthCostResponse);
        const formattedEc2YearlyCost = sumMonthlyCosts(ec2YearlyCostResponse);
        const formattedEbsYearlyCost = sumMonthlyCosts(ebsYearlyCostResponse);
        const formattedS3YearlyCost = sumMonthlyCosts(s3YearlyCostResponse);

        const formattedEc2CurrentMonthCost = sumMonthlyCosts(ec2CurrentMonthCostResponse);
        const formattedEbsCurrentMonthCost = sumMonthlyCosts(ebsCurrentMonthCostResponse);
        const formattedS3CurrentMonthCost = sumMonthlyCosts(s3CurrentMonthCostResponse);

        res.json({
            Yearly: {
                TimePeriod: {
                    Start: startOfYear,
                    End: endDate
                },
                Total: formattedTotalYearlyCost,
                EC2: formattedEc2YearlyCost,
                EBS: formattedEbsYearlyCost,
                S3: formattedS3YearlyCost
            },
            CurrentMonth: {
                TimePeriod: {
                    Start: startOfCurrentMonth,
                    End: endDate
                },
                Total: formattedTotalCurrentMonthCost,
                EC2: formattedEc2CurrentMonthCost,
                EBS: formattedEbsCurrentMonthCost,
                S3: formattedS3CurrentMonthCost
            },
            PreviousMonth: {
                TimePeriod: {
                    Start: startOfPreviousMonth,
                    End: endOfPreviousMonth
                },
                Total: formattedTotalPreviousMonthCost
            }
        });

    } catch (error) {
        console.error("Error in costdetails:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { costdetails };
