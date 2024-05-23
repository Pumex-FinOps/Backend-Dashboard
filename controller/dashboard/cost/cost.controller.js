const { getCostAndUsage } = require("./cost.services");

const getCostForResource = async (resources) => {
    console.log("Resources:", resources);
    return await getCostAndUsage({
        Filter: {
            Dimensions: {
                Key: "SERVICE",
                Values: resources
            }
        }
    });
};

const costdetails = async (req, res) => {
    try {
        // Fetch total cost without any filter
        let totalCostResponse = await getCostAndUsage({});
        
        // Fetch cost for specific services
        let ec2CostResponse = await getCostForResource([
            "Amazon Elastic Compute Cloud - Compute",
            "EC2 - Other"
        ]);

        let ebsCostResponse = await getCostForResource(["Amazon Elastic Block Store"]);
        let s3CostResponse = await getCostForResource(["Amazon Simple Storage Service"]);

        const formatCostData = (response) => {
            return response.ResultsByTime.map(result => {
                let totalCost = result.Total ? parseFloat(result.Total.UnblendedCost.Amount) : 0;
                return {
                    TimePeriod: result.TimePeriod,
                    Total: totalCost
                };
            });
        };

        const formattedTotalCost = formatCostData(totalCostResponse);
        const formattedEc2Cost = formatCostData(ec2CostResponse);
        const formattedEbsCost = formatCostData(ebsCostResponse);
        const formattedS3Cost = formatCostData(s3CostResponse);

        const mergedResults = formattedTotalCost.map((total, index) => {
            return {
                TimePeriod: total.TimePeriod,
                Total: total.Total,
                EC2: formattedEc2Cost[index]?.Total || 0,
                EBS: formattedEbsCost[index]?.Total || 0,
                S3: formattedS3Cost[index]?.Total || 0
            };
        });

        res.json(mergedResults);

    } catch (error) {
        console.error("Error in costdetails:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { costdetails };


