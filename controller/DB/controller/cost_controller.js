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
const updateAwsCost = async () => {
    try {
        console.log("inside updateAwsCost");

        // Fetch cost details and resource counts
        let costdetail = await costdetails();
        let resourceCounts = await resourceCount();

        // Prepare the total result object
        let totalResult = {
            ...costdetail,
            count: resourceCounts
        };

        
        const filter = {}; 

        // Update object with $set to ensure only existing fields are updated
        const update = {
            $set: {
                data: totalResult,
                updatedAt: new Date()
            }
        };

        // Options for the update operation
        const options = { upsert: true };

        // Perform the update operation
        const updatedCost = await Cost.updateOne(filter, update, options);

        console.log(updatedCost);
    } catch (error) {
        console.error(error);
    }
};

const displayCost = async (req, res) => {
    try {
        const display = await Cost.find();
        console.log(display);
        res.status(200).json({
            message: "Cost data",
            data: display
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error while fetching  data' });
    }
};



module.exports.getAndSaveAwsCost = getAndSaveAwsCost
module.exports.updateAwsCost = updateAwsCost
module.exports.displayCost = displayCost