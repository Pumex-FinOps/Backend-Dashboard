// const AWS = require("../../../config/aws");
// const { regionList } = require("../../../config/RegionList");
// const ThrottleFixer = require("aws-throttle-fixer");
// const TF = new ThrottleFixer();
// const tfConfig = {
//     retryCount: 24,
//     //logger: console.log,
//     sdkVersion: 2,
//     exceptionCodes: ["RequestLimitExceeded"],
//     ignoreRetryState: true
// };
// TF.configure(tfConfig);
// const throttleFixFunction = TF.throttleFixer();
// var throttle = require('promise-ratelimit')(600); /* rateInMilliseconds */

// // Function to get details of EC2 instances in a specific region
// const describeInstance = async (region) => {
//     let ec2 = new AWS.EC2({ region: region });
//     let result = await ec2.describeInstances().promise();
//     let arns = [];

//     for (let reservation of result.Reservations) {
//         for (let instance of reservation.Instances) {
//             let accountId = '233425133219'; // Assuming you have the account ID configured
//             let arn = `arn:aws:ec2:${region}:${accountId}:instance/${instance.InstanceId}`;
//             arns.push(arn);
//         }
//     }

//     return { count: arns.length, arns: arns };
// };

// // Function to get details of EBS volumes in a specific region
// const volumeDetails = async (region) => {
//     let ec2 = new AWS.EC2({ region: region });
//     let result = await ec2.describeVolumes().promise();
//     let arns = [];

//     for (let volume of result.Volumes) {
//         let accountId = '233425133219';
//         let arn = `arn:aws:ec2:${region}:${accountId}:volume/${volume.VolumeId}`;
//         arns.push(arn);
//     }

//     return { count: arns.length, arns: arns };
// };

// const s3BucketDetails = async () => {
//     try {
//         let s3 = new AWS.S3();
//         let data = await s3.listBuckets().promise();
//         return { count: data.Buckets.length };
//     } catch (error) {
//         console.error('Error getting S3 bucket details:', error);
//         return { count: 0 };
//     }
// };

// // Function to get details of Lambda functions in a specific region
// const lambdaDetails = async (region) => {
//     let lambda = new AWS.Lambda({ region: region });
//     let result = await lambda.listFunctions().promise();
//     let arns = [];

//     for (let func of result.Functions) {
//         let accountId = '233425133219'; // Assuming you have the account ID configured
//         let arn = `arn:aws:lambda:${region}:${accountId}:function:${func.FunctionName}`;
//         arns.push(arn);
//     }

//     return { count: arns.length, arns: arns };
// };

// // Function to get details of CloudWatch log groups in a specific region
// const cloudWatchLogDetails = async (region) => {
//     let cloudwatchlogs = new AWS.CloudWatchLogs({ region: region });
//     let result = await cloudwatchlogs.describeLogGroups().promise();
//     let arns = [];

//     for (let logGroup of result.logGroups) {
//         let accountId = '233425133219'; // Assuming you have the account ID configured
//         let arn = `arn:aws:logs:${region}:${accountId}:log-group:${logGroup.logGroupName}`;
//         arns.push(arn);
//     }

//     return { count: arns.length, arns: arns };
// };

// module.exports = {
//     describeInstance,
//     volumeDetails,
//     s3BucketDetails,
//     lambdaDetails,
//     cloudWatchLogDetails
// };

const AWS = require("../../../config/aws");
const { regionList } = require("../../../config/RegionList");
const ThrottleFixer = require("aws-throttle-fixer");
const TF = new ThrottleFixer();
const tfConfig = {
    retryCount: 24,
    //logger: console.log,
    sdkVersion: 2,
    exceptionCodes: ["RequestLimitExceeded"],
    ignoreRetryState: true
};
TF.configure(tfConfig);
const throttleFixFunction = TF.throttleFixer();
var throttle = require('promise-ratelimit')(600); /* rateInMilliseconds */

const accountId = '233425133219'; // Assuming you have the account ID configured

// Function to get details of EC2 instances in a specific region
const describeInstance = async (region) => {
    let ec2 = new AWS.EC2({ region: region });
    let result = await ec2.describeInstances().promise();
    let instances = [];

    for (let reservation of result.Reservations) {
        for (let instance of reservation.Instances) {
            let arn = `arn:aws:ec2:${region}:${accountId}:instance/${instance.InstanceId}`;
            instances.push({
                arn: arn,
                name: instance.Tags.find(tag => tag.Key === 'Name')?.Value || 'Unnamed',
                applicationName: instance.Tags.find(tag => tag.Key === 'ApplicationName')?.Value || 'Unknown',
                accountId: accountId
            });
        }
    }

    return { count: instances.length, instances: instances };
};

// Function to get details of EBS volumes in a specific region
const volumeDetails = async (region) => {
    let ec2 = new AWS.EC2({ region: region });
    let result = await ec2.describeVolumes().promise();
    let volumes = [];

    for (let volume of result.Volumes) {
        let arn = `arn:aws:ec2:${region}:${accountId}:volume/${volume.VolumeId}`;
        volumes.push({
            arn: arn,
            name: volume.Tags.find(tag => tag.Key === 'Name')?.Value || 'Unnamed',
            applicationName: volume.Tags.find(tag => tag.Key === 'ApplicationName')?.Value || 'Unknown',
            accountId: accountId
        });
    }

    return { count: volumes.length, volumes: volumes };
};

// Function to get S3 bucket details
const s3BucketDetails = async () => {
    try {
        let s3 = new AWS.S3();
        let data = await s3.listBuckets().promise();

        // Create a promise for each bucket to fetch its tags
        let bucketsWithTagsPromises = data.Buckets.map(async bucket => {
            let tagData = await s3.getBucketTagging({ Bucket: bucket.Name }).promise().catch(() => ({ TagSet: [] }));
            let tags = Object.fromEntries(tagData.TagSet.map(tag => [tag.Key, tag.Value]));
            return {
                arn: `arn:aws:s3:::${bucket.Name}`,
                name: bucket.Name,
                applicationName: tags['ApplicationName'] || 'Unknown',
                accountId: accountId
            };
        });

        let buckets = await Promise.all(bucketsWithTagsPromises);

        return { count: buckets.length, buckets: buckets };
    } catch (error) {
        console.error('Error getting S3 bucket details:', error);
        return { count: 0, buckets: [] };
    }
};

// Function to get details of Lambda functions in a specific region
const lambdaDetails = async (region) => {
    let lambda = new AWS.Lambda({ region: region });
    let result = await lambda.listFunctions().promise();
    let functions = [];
    
    for (let func of result.Functions) {
        let arn = `arn:aws:lambda:${region}:${accountId}:function:${func.FunctionName}`;
        
        // Fetch tags for each function
        let tagsResult;
        try {
            tagsResult = await lambda.listTags({ Resource: arn }).promise();
        } catch (error) {
            console.error(`Error fetching tags for ${func.FunctionName}:`, error);
            tagsResult = { Tags: {} }; // Default to empty tags on error
        }

        functions.push({
            arn: arn,
            name: func.FunctionName,
            applicationName: tagsResult.Tags['ApplicationName'] || 'Unknown',
            accountId: accountId
        });
    }

    return { count: functions.length, functions: functions };
};

// Function to get details of CloudWatch log groups in a specific region
const cloudWatchLogDetails = async (region) => {
    let cloudwatchlogs = new AWS.CloudWatchLogs({ region: region });
    let result = await cloudwatchlogs.describeLogGroups().promise();
    let logGroups = [];

    for (let logGroup of result.logGroups) {
        let arn = `arn:aws:logs:${region}:${accountId}:log-group:${logGroup.logGroupName}`;
        let tags = await cloudwatchlogs.listTagsLogGroup({ logGroupName: logGroup.logGroupName }).promise().catch(() => ({ tags: {} }));
        logGroups.push({
            arn: arn,
            name: logGroup.logGroupName,
            applicationName: tags.tags['ApplicationName'] || 'Unknown',
            accountId: accountId
        });
    }

    return { count: logGroups.length, logGroups: logGroups };
};

module.exports = {
    describeInstance,
    volumeDetails,
    s3BucketDetails,
    lambdaDetails,
    cloudWatchLogDetails
};
