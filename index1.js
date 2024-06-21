const AWS = require("./config/aws");

// Configure AWS SDK with your region
AWS.config.update({ region: 'us-east-1' }); // Replace with your region

// Create Cost Explorer service object
const ce = new AWS.CostExplorer();

// Example function to get cost of specific resource by RESOURCE_ID
async function getResourceCostByResourceId(resourceId) {
    try {
        const params = {
            TimePeriod: {
                Start: '2024-06-10', // Start date for cost analysis
                End: '2024-06-19'    // End date for cost analysis
            },
            Granularity: 'MONTHLY',
            Metrics: ['BlendedCost'],
            Filter: {
                Dimensions: {
                    Key: 'RESOURCE_ID', // Filter by resource ID
                    Values: [resourceId]
                }
            }
        };

        const data = await ce.getCostAndUsageWithResources(params).promise();
        console.log(data); // Output the cost data (you may want to parse and process this)
    } catch (err) {
        console.error('Error retrieving cost:', err);
    }
}

// Example usage
const resourceId = 'i-08f5fd623fe056e86'; // Replace with your resource ID
getResourceCostByResourceId(resourceId);


