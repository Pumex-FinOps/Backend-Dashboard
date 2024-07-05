
// const AWS = require("./config/aws");
// const { regionList } = require("./config/RegionList");

// async function getCostOfAllEc2Instances() {
//     try {
//         for (const region of regionList) {
//             AWS.config.update({ region });

//             const ce = new AWS.CostExplorer();
//             const ec2 = new AWS.EC2();

//             // Describe EC2 instances to get their IDs
//             const ec2Params = {
//                 Filters: [
//                     {
//                         Name: 'instance-state-name',
//                         Values: ['running', 'stopped'] // Include both running and stopped instances
//                     }
//                 ]
//             };
//             const ec2Data = await ec2.describeInstances(ec2Params).promise();
//             const instanceIds = [];
//             ec2Data.Reservations.forEach(reservation => {
//                 reservation.Instances.forEach(instance => {
//                     instanceIds.push(instance.InstanceId);
//                 });
//             });

//             // If no instances in this region, skip to next region
//             if (instanceIds.length === 0) continue;

//             const params = {
//                 TimePeriod: {
//                     Start: '2024-06-20', // Start date for cost analysis
//                     End: '2024-07-03'    // End date for cost analysis
//                 },
//                 Granularity: 'MONTHLY',
//                 Metrics: ['BlendedCost'],
//                 GroupBy: [
//                     {
//                         Type: 'DIMENSION',
//                         Key: 'RESOURCE_ID'
//                     }
//                 ],
//                 Filter: {
//                     Dimensions: {
//                         Key: 'SERVICE',
//                         Values: ['Amazon Elastic Compute Cloud - Compute'] // Filter to only EC2 instances
//                     }
//                 }
//             };

//             const costData = await ce.getCostAndUsageWithResources(params).promise();

//             // Output the cost data for each resource
//             costData.ResultsByTime.forEach(result => {
//                 result.Groups.forEach(group => {
//                     const resourceId = group.Keys[0]; // Resource ID
//                     const cost = group.Metrics.BlendedCost.Amount; // Cost

//                     // Check if resourceId is in the instanceIds list
//                     if (instanceIds.includes(resourceId)) {
//                         console.log(`Resource ID: ${resourceId}, Region: ${region}, Cost: ${cost}`);
//                     }
//                 });
//             });
//         }
//     } catch (err) {
//         console.error('Error retrieving cost:', err);
//     }
// }

// // Example usage
// getCostOfAllEc2Instances();


const AWS = require("./config/aws");
const { regionList } = require("./config/RegionList");

const accountId = '123456789012'; // Replace with your account ID

async function getCostOfAllEc2Instances() {
    try {
        for (const region of regionList) {
            AWS.config.update({ region });

            const ce = new AWS.CostExplorer();
            const ec2 = new AWS.EC2();

            // Describe EC2 instances to get their IDs and tags
            const ec2Params = {
                Filters: [
                    {
                        Name: 'instance-state-name',
                        Values: ['running', 'stopped'] // Include both running and stopped instances
                    }
                ]
            };
            const ec2Data = await ec2.describeInstances(ec2Params).promise();
            const instances = [];
            ec2Data.Reservations.forEach(reservation => {
                reservation.Instances.forEach(instance => {
                    instances.push({
                        InstanceId: instance.InstanceId,
                        Tags: instance.Tags
                    });
                });
            });

            // If no instances in this region, skip to next region
            if (instances.length === 0) continue;

            const params = {
                TimePeriod: {
                    Start: '2024-06-20', // Start date for cost analysis
                    End: '2024-07-03'    // End date for cost analysis
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

                    // Find the instance with this resourceId
                    const instance = instances.find(inst => inst.InstanceId === resourceId);

                    if (instance) {
                        // Extract application name from tags
                        const appNameTag = instance.Tags.find(tag => tag.Key === 'ApplicationName');
                        const appName = appNameTag ? appNameTag.Value : 'Unknown';

                        console.log(`Account ID: ${accountId}, Resource ID: ${resourceId}, Region: ${region}, Application Name: ${appName}, Cost: ${cost}`);
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
