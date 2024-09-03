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