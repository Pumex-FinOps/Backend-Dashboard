const resourceCounts = require('../model/resourceCountSchema');
const { resourceCount } = require('../../dashboard/resources/resources.controller')

const updateresourceCounts = async (req, res) => {
    try {
        console.log("inside updateAwsCost");
        //let costdetail = await costdetails();
        let resourceCounts = await resourceCount();
        console.log("resourceCounts", resourceCounts);

        for (const account of resourceCounts.AllAccounts) {
            const { AccountId } = account;
            await Cost.updateOne(
                { accountId: AccountId },
                {
                    $set: {

                        data: resourceCounts
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



module.exports.updateresourceCounts = updateresourceCounts