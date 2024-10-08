const ResourceCost = require("../model/resourceCostSchema")
const { getCostOfAllResources } = require("../../dashboard/resourseLevelCost/resourcelevelcost.controller")

const updateResourceLevelCost = async () => {
    try {
        console.log("inside updatresourceCost");

        let resourceLevelCost = await getCostOfAllResources();

        let totalResult = {
            ...resourceLevelCost
        };


        const filter = {};
        const update = {
            data: totalResult,
            updatedAt: new Date()
        };

        const options = { upsert: true, new: true };

        const updatedCost = await ResourceCost.updateOne(filter, update, options);

        console.log(updatedCost);
    } catch (error) {
        console.error(error);
    }
};
const displayResourceLevelCost = async (req, res) => {
    const { accountId } = req.query; 

    if (!accountId) {
        return res.status(400).json({
            message: "Account ID is required"
        });
    }

    try {
        const resourceLevelCostData = await ResourceCost.find({ accountId });

        if (!resourceLevelCostData || resourceLevelCostData.length === 0) {
            return res.status(404).json({
                message: `No resource-level cost data found for accountId: ${accountId}`
            });
        }

        // Return the resource-level cost data
        res.status(200).json({
            message: "Resource-level cost data retrieved successfully",
            data: resourceLevelCostData
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error while fetching resource-level cost data' });
    }
};



module.exports.updateResourceLevelCost = updateResourceLevelCost
module.exports.displayResourceLevelCost = displayResourceLevelCost
