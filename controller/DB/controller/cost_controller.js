const Cost = require('../model/costSchema');
const { costdetails } = require('../../dashboard/cost/cost.controller')
const { resourceCount } = require('../../dashboard/resources/resources.controller')


const getAndSaveAwsCost = async () => {
    try {
        console.log("inside getAndSaveAwsCost");
        let costdetail = await costdetails()
        //console.log("costdetail", costdetail);
        let resourceCounts = await resourceCount()
        //console.log("resourceCounts", resourceCounts);
        let totalResult = {
            ...costdetail,
            count: resourceCounts
        }
        //console.log("totalResult",totalResult);
        const newCost = new Cost({ data: totalResult });
        await newCost.save();
        console.log(newCost);
    } catch (error) {
        console.log(error);
    }


}
const updateAwsCost = async (req, res) => {
    try {
        console.log("inside updateAwsCost");
        let costdetail = await costdetails();
        // let resourceCounts = await resourceCount();
        for (const account of costdetail.AllAccounts) {
            const { AccountId, Yearly, CurrentMonth } = account;
            await Cost.updateOne(
                { accountId: AccountId },
                {
                    $set: {
                        platform: 'AWS',
                        data: {
                            Yearly,
                            CurrentMonth
                        }
                    }
                },
                { upsert: true } // Create a new document if no document matches the filter
            );
        }
        console.log('Data successfully updated in the database.');
    } catch (error) {
        console.error(error);
    }
};
const getAccountIds = async (req, res) => {
    try {
        const accountIds = await Cost.distinct('accountId');
        res.status(200).json({
            success: true,
            data: accountIds,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving account IDs',
        });
    }
};

const displayCost = async (req, res) => {
    const { accountId } = req.query; // Retrieve accountId from query parameters
    if (!accountId) {
        return res.status(400).json({
            message: "Account ID is required"
        });
    }

    try {
        // Fetch cost details for the specific accountId
        const costDetails = await Cost.find({ accountId });

        if (!costDetails || costDetails.length === 0) {
            return res.status(404).json({
                message: `No cost data found for accountId: ${accountId}`
            });
        }

        // Aggregation to calculate total cost for the current month
        const monthlyTotal = await Cost.aggregate([
            {
                $group: {
                    _id: null,
                    totalMonthlyCost: { $sum: { $ifNull: ["$data.CurrentMonth.Total", 0] } }
                }
            }
        ]);

        // Aggregation to calculate total cost for the current year
        const yearlyTotal = await Cost.aggregate([
            {
                $group: {
                    _id: null,
                    totalYearlyCost: { $sum: { $ifNull: ["$data.Yearly.Total", 0] } }
                }
            }
        ]);

        const totalMonthlyCost = monthlyTotal.length > 0 ? monthlyTotal[0].totalMonthlyCost : 0;
        const totalYearlyCost = yearlyTotal.length > 0 ? yearlyTotal[0].totalYearlyCost : 0;
        res.status(200).json({
            message: "Cost details and total costs",
            costDetails: costDetails,
            totalAllAccountsMonthlyCost: totalMonthlyCost,
            totalAllAccountsYearlyCost: totalYearlyCost
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error while fetching cost data and totals' });
    }
};




module.exports.getAndSaveAwsCost = getAndSaveAwsCost
module.exports.updateAwsCost = updateAwsCost
module.exports.displayCost = displayCost
module.exports.getAccountIds = getAccountIds