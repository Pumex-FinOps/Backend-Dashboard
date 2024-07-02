// const AWS = require("./config/aws");

// // Configure AWS SDK with your region
// AWS.config.update({ region: 'us-east-1' }); // Replace with your region

// const ce = new AWS.CostExplorer();

// async function getResourceCostByResourceId(resourceId) {
//     try {
//         const params = {
//             TimePeriod: {
//                 Start: '2024-06-20', // Start date for cost analysis
//                 End: '2024-06-29'    // End date for cost analysis
//             },
//             Granularity: 'MONTHLY',
//             Metrics: ['BlendedCost'],
//             Filter: {
//                 Dimensions: {
//                     Key: 'RESOURCE_ID', // Filter by resource ID
//                     Values: [resourceId]
//                 }
//             }
//         };

//         const data = await ce.getCostAndUsageWithResources(params).promise();
//         console.log(data.ResultsByTime[0].Total); // Output the cost data (you may want to parse and process this)
//     } catch (err) {
//         console.error('Error retrieving cost:', err);
//     }
// }

// // Example usage
// const resourceId = 'i-0da0063ca794e7fa7'; // Replace with your resource ID
// getResourceCostByResourceId(resourceId);

const AWS = require("./config/aws");
const { regionList } = require("./config/RegionList");

async function getCostOfAllEc2Instances() {
    try {
        for (const region of regionList) {
            AWS.config.update({ region });

            const ce = new AWS.CostExplorer();
            const ec2 = new AWS.EC2();

            // Describe EC2 instances to get their IDs
            const ec2Params = {
                Filters: [
                    {
                        Name: 'instance-state-name',
                        Values: ['running', 'stopped'] // Include both running and stopped instances
                    }
                ]
            };
            const ec2Data = await ec2.describeInstances(ec2Params).promise();
            const instanceIds = [];
            ec2Data.Reservations.forEach(reservation => {
                reservation.Instances.forEach(instance => {
                    instanceIds.push(instance.InstanceId);
                });
            });

            // If no instances in this region, skip to next region
            if (instanceIds.length === 0) continue;

            const params = {
                TimePeriod: {
                    Start: '2024-06-20', // Start date for cost analysis
                    End: '2024-06-29'    // End date for cost analysis
                },
                Granularity: 'MONTHLY',
                Metrics: ['BlendedCost'],
                GroupBy: [
                    {
                        Type: 'DIMENSION',
                        Key: 'RESOURCE_ID'
                    }
                ],
                Filter: {
                    Dimensions: {
                        Key: 'SERVICE',
                        Values: ['Amazon Elastic Compute Cloud - Compute'] // Filter to only EC2 instances
                    }
                }
            };

            const costData = await ce.getCostAndUsageWithResources(params).promise();

            // Output the cost data for each resource
            costData.ResultsByTime.forEach(result => {
                result.Groups.forEach(group => {
                    const resourceId = group.Keys[0]; // Resource ID
                    const cost = group.Metrics.BlendedCost.Amount; // Cost

                    // Check if resourceId is in the instanceIds list
                    if (instanceIds.includes(resourceId)) {
                        console.log(`Resource ID: ${resourceId}, Region: ${region}, Cost: ${cost}`);
                    }
                });
            });
        }
    } catch (err) {
        console.error('Error retrieving cost:', err);
    }
}

// Example usage
getCostOfAllEc2Instances();
