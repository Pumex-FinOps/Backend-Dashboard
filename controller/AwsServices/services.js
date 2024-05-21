const AWS = require("../../config/aws");
const { regionList } = require("../../config/RegionList");
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

let costexplorer = new AWS.CostExplorer();





// Function to get details of EC2 instances in a specific region
const describeInstance = async (region) => {
    let ec2 = new AWS.EC2({ region: region });
    let result = await ec2.describeInstances().promise();
    let arns = [];

    for (let reservation of result.Reservations) {
        for (let instance of reservation.Instances) {
            let accountId = '233425133219'; // Assuming you have the account ID configured
            let arn = `arn:aws:ec2:${region}:${accountId}:instance/${instance.InstanceId}`;
            arns.push(arn);
        }
    }

    return { count: arns.length, arns: arns };
};

// Function to get details of EBS volumes in a specific region
const volumeDetails = async (region) => {
    let ec2 = new AWS.EC2({ region: region });
    let result = await ec2.describeVolumes().promise();
    let arns = [];

    for (let volume of result.Volumes) {
        let accountId = '233425133219';
        let arn = `arn:aws:ec2:${region}:${accountId}:volume/${volume.VolumeId}`;
        arns.push(arn);
    }

    return { count: arns.length, arns: arns };
};

const s3BucketDetails = async () => {
    try {
        let s3 = new AWS.S3();
        let data = await s3.listBuckets().promise();
        return { count: data.Buckets.length };
    } catch (error) {
        console.error('Error getting S3 bucket details:', error);
        return { count: 0 };
    }
};

const getCostAndUsage = async (filter) => {
    console.log("Filter:", filter);

    let params = {
        Granularity: "MONTHLY",
        Metrics: ["UnblendedCost"],
        TimePeriod: {
            End: '2024-05-23', 
            Start: '2024-05-01' 
        }
    };

    if (filter && filter.Filter) {
        params.Filter = filter.Filter;
    }

    try {
        let response = await throttleFixFunction(costexplorer, "getCostAndUsage", params);
        return response;
    } 
    catch (error) {
        console.error("Error in getCostAndUsage:", error);
        throw new Error("Error fetching cost and usage data");
    }
};

module.exports.getCostAndUsage = getCostAndUsage

module.exports.s3BucketDetails = s3BucketDetails
module.exports.volumeDetails = volumeDetails
module.exports.describeInstance = describeInstance
