// const AWS = require("../../../config/aws");
// const { regionList } = require("../../../config/RegionList");

// const accountId = '123456789012'; // Replace with your account ID

// function getFormattedDate(date) {
//     return date.toISOString().split('T')[0];
// }

// async function getCostOfAllEc2Instances() {
//     const results = [];

//     const endDate = new Date();
//     const startDate = new Date();
//     startDate.setDate(endDate.getDate() - 14);

//     const formattedEndDate = getFormattedDate(endDate);
//     const formattedStartDate = getFormattedDate(startDate);

//     for (const region of regionList) {
//         AWS.config.update({ region });

//         const ce = new AWS.CostExplorer();
//         const ec2 = new AWS.EC2();

//         const ec2Params = {
//             Filters: [
//                 {
//                     Name: 'instance-state-name',
//                     Values: ['running', 'stopped']
//                 }
//             ]
//         };
//         const ec2Data = await ec2.describeInstances(ec2Params).promise();
//         const instances = [];
//         ec2Data.Reservations.forEach(reservation => {
//             reservation.Instances.forEach(instance => {
//                 instances.push({
//                     InstanceId: instance.InstanceId,
//                     Tags: instance.Tags
//                 });
//             });
//         });

//         if (instances.length === 0) continue;

//         const params = {
//             TimePeriod: {
//                 Start: formattedStartDate,
//                 End: formattedEndDate
//             },
//             Granularity: 'MONTHLY',
//             Metrics: ['BlendedCost'],
//             GroupBy: [
//                 {
//                     Type: 'DIMENSION',
//                     Key: 'RESOURCE_ID'
//                 }
//             ],
//             Filter: {
//                 Dimensions: {
//                     Key: 'SERVICE',
//                     Values: ['Amazon Elastic Compute Cloud - Compute']
//                 }
//             }
//         };

//         const costData = await ce.getCostAndUsageWithResources(params).promise();

//         costData.ResultsByTime.forEach(result => {
//             result.Groups.forEach(group => {
//                 const resourceId = group.Keys[0];
//                 const cost = group.Metrics.BlendedCost.Amount;

//                 const instance = instances.find(inst => inst.InstanceId === resourceId);

//                 if (instance) {
//                     const appNameTag = instance.Tags.find(tag => tag.Key === 'ApplicationName');
//                     const appName = appNameTag ? appNameTag.Value : 'Unknown';

//                     results.push({
//                         AccountId: accountId,
//                         ResourceId: resourceId,
//                         Region: region,
//                         ApplicationName: appName,
//                         Cost: cost
//                     });
//                 }
//             });
//         });
//     }

//     return results;
// }

// module.exports = {
//     getCostOfAllEc2Instances
// };


const AWS = require("../../../config/aws");
const { regionList } = require("../../../config/RegionList");


const accountId = '123456789012'; // Replace with your account ID

function getFormattedDate(date) {
    return date.toISOString().split('T')[0];
}

async function getCostOfAllResources() {
    const results = {
        EC2: [],
        EBS: [],
        S3: [],
        Lambda: []
    };

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 14);

    const formattedEndDate = getFormattedDate(endDate);
    const formattedStartDate = getFormattedDate(startDate);

    for (const region of regionList) {
        AWS.config.update({ region });

        const ce = new AWS.CostExplorer();
        const ec2 = new AWS.EC2();
        const s3 = new AWS.S3();
        const lambda = new AWS.Lambda();

        // Fetch EC2 instances
        const ec2Params = {
            Filters: [
                {
                    Name: 'instance-state-name',
                    Values: ['running', 'stopped']
                }
            ]
        };
        const ec2Data = await ec2.describeInstances(ec2Params).promise();
        const instances = [];
        ec2Data.Reservations.forEach(reservation => {
            reservation.Instances.forEach(instance => {
                instances.push({
                    ResourceId: instance.InstanceId,
                    Tags: instance.Tags
                });
            });
        });

        // // Fetch EBS volumes
        // const ebsData = await ec2.describeVolumes().promise();
        // const volumes = ebsData.Volumes.map(volume => ({
        //     ResourceId: volume.VolumeId,
        //     Tags: volume.Tags
        
        // }));
        // volumes.forEach(volume => {
        //     console.log(`Tags for Volume ${volume.ResourceId}:`, volume.Tags);
        // });

        // Fetch S3 buckets
        // const s3Buckets = await s3.listBuckets().promise();
        // const buckets = [];
        // for (const bucket of s3Buckets.Buckets) {
        //     try {
        //         const taggingData = await s3.getBucketTagging({ Bucket: bucket.Name }).promise();
        //         buckets.push({
        //             ResourceId: bucket.Name,
        //             Tags: taggingData.TagSet
        //         });
        //     } catch (err) {
        //         // Handle buckets without tags or insufficient permissions gracefully
        //         if (err.code !== 'NoSuchTagSet') {
        //             console.error(`Error fetching tags for S3 bucket ${bucket.Name}:`, err);
        //         }
        //     }
        // }

        // // Fetch Lambda functions
        // const lambdaFunctions = await lambda.listFunctions().promise();
        // const functions = [];
        // for (const func of lambdaFunctions.Functions) {
        //     const tags = await lambda.listTags({ Resource: func.FunctionArn }).promise();
        //     functions.push({
        //         ResourceId: func.FunctionName,
        //         Tags: tags.Tags
        //     });
        // }

        // const resources = [...instances, ...volumes, ...buckets, ...functions];
        const resources = [...instances];


        const services = [
            { service: 'Amazon Elastic Compute Cloud - Compute', key: 'EC2' }
            // { service: 'Amazon Elastic Block Store', key: 'EBS' }
            // { service: 'Amazon Simple Storage Service', key: 'S3' },
            // { service: 'AWS Lambda', key: 'Lambda' }
        ];

        for (const { service, key } of services) {
            const params = {
                TimePeriod: {
                    Start: formattedStartDate,
                    End: formattedEndDate
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
                        Values: [service]
                    }
                }
            };

            const costData = await ce.getCostAndUsageWithResources(params).promise();

            costData.ResultsByTime.forEach(result => {
                result.Groups.forEach(group => {
                    const resourceId = group.Keys[0];
                    const cost = group.Metrics.BlendedCost.Amount;

                    const resource = resources.find(res => res.ResourceId === resourceId);

                    if (resource) {
                        const appNameTag = resource.Tags.find(tag => tag.Key === 'ApplicationName');
                        const appName = appNameTag ? appNameTag.Value : 'Unknown';

                        results[key].push({
                            AccountId: accountId,
                            ResourceId: resourceId,
                            Region: region,
                            ApplicationName: appName,
                            Cost: cost,
                            Service: service
                        });
                    }
                });
            });
        }
    }

    return results;
}

module.exports = {
    getCostOfAllResources
};

