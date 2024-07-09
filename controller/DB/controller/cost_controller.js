const Cost = require('../model/costSchema');
const { costdetails } = require('../../dashboard/cost/cost.controller')
const { resourceCount } = require('../../dashboard/resources/resources.controller')


const getAndSaveAwsCost = async () => {
    try {
        console.log("inside getAndSaveAwsCost");
        let costdetail = await costdetails()
        console.log("costdetail", costdetail);
        let resourceCounts = await resourceCount()
        let totalResult = {
            ...costdetail,
            ...resourceCounts
        }
        ///console.log(totalResult);

    } catch (error) {
        console.log(error);
    }


}



module.exports.getAndSaveAwsCost = getAndSaveAwsCost