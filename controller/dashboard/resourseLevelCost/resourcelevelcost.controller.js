const resourceLevelCostService = require('./resourcelevelcost.service');

async function getCostOfAllResources(req, res) {
    try {
        const data = await resourceLevelCostService.getCostOfAllResources();
        res.status(200).json(data);
    } catch (err) {
        console.error('Error retrieving cost:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getCostOfAllResources
};
