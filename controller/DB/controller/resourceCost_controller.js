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
    try {
        const display = await ResourceCost.find();
        //console.log(display);
        res.status(200).json({
            message: "ResourceLevelCost data",
            data: display
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error while fetching  data' });
    }
};


module.exports.updateResourceLevelCost = updateResourceLevelCost
module.exports.displayResourceLevelCost = displayResourceLevelCost
