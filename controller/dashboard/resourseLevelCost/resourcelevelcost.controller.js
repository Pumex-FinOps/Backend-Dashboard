// resourcelevelcost.controller.js

const resourceLevelCostService = require('./resourcelevelcost.service');

async function getCostOfAllResources(req, res) {
    try {
        const data = await resourceLevelCostService.getCostOfAllResources();
        if (res) {
            res.status(200).json(data);
        }
        return data;
    } catch (err) {
        console.error('Error retrieving cost:', err);
        if (res) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
        throw err;
    }
}

module.exports = {
    getCostOfAllResources
};

