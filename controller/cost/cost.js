const { getCostAndUsage } = require("../AwsServices/services");

const costdetails = async (req, res) => {
    try {
        let response = await getCostAndUsage();

        const formattedData = response.ResultsByTime.map(ResultsByTime => {
            return {
                TimePeriod: ResultsByTime.TimePeriod,
                Total: ResultsByTime.Total.UsageQuantity
            };
        });
        res.json(formattedData);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports.costdetails = costdetails;
