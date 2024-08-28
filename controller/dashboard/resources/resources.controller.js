
// const { s3BucketDetails, volumeDetails, describeInstance, lambdaDetails, cloudWatchLogDetails } = require("./resources.services");
// const { regionList } = require("../../../config/RegionList");

// const resourceCount = async (req, res) => {
//     console.log("inside");
//     try {
//         let ec2DetailsPromises = regionList.map(region => describeInstance(region));
//         let ebsDetailsPromises = regionList.map(region => volumeDetails(region));
//         let lambdaDetailsPromises = regionList.map(region => lambdaDetails(region));
//         let cloudWatchLogDetailsPromises = regionList.map(region => cloudWatchLogDetails(region));

//         let [ec2Results, ebsResults, s3Result, lambdaResults, cloudWatchLogResults] = await Promise.all([
//             Promise.all(ec2DetailsPromises),
//             Promise.all(ebsDetailsPromises),
//             s3BucketDetails(),
//             Promise.all(lambdaDetailsPromises),
//             Promise.all(cloudWatchLogDetailsPromises)
//         ]);

//         let ec2TotalCount = ec2Results.reduce((acc, cur) => acc + cur.count, 0);
//         let ebsTotalCount = ebsResults.reduce((acc, cur) => acc + cur.count, 0);
//         let s3TotalCount = s3Result.count;
//         let lambdaTotalCount = lambdaResults.reduce((acc, cur) => acc + cur.count, 0);
//         let cloudWatchLogTotalCount = cloudWatchLogResults.reduce((acc, cur) => acc + cur.count, 0);

//         let ec2InstancesByRegion = Object.fromEntries(ec2Results.map((result, index) => [regionList[index], result.instances]));
//         let ebsVolumesByRegion = Object.fromEntries(ebsResults.map((result, index) => [regionList[index], result.volumes]));
//         let lambdaFunctionsByRegion = Object.fromEntries(lambdaResults.map((result, index) => [regionList[index], result.functions]));
//         let cloudWatchLogGroupsByRegion = Object.fromEntries(cloudWatchLogResults.map((result, index) => [regionList[index], result.logGroups]));

//         const responseData = {
//             ec2: { totalCount: ec2TotalCount, details: ec2InstancesByRegion },
//             ebs: { totalCount: ebsTotalCount, details: ebsVolumesByRegion },
//             s3: { totalCount: s3TotalCount, details: s3Result.buckets },
//             lambda: { totalCount: lambdaTotalCount, details: lambdaFunctionsByRegion },
//             cloudWatchLogs: { totalCount: cloudWatchLogTotalCount, details: cloudWatchLogGroupsByRegion },
//             total: ec2TotalCount + ebsTotalCount + s3TotalCount + lambdaTotalCount + cloudWatchLogTotalCount
//         };

//         console.log('Response Data:', JSON.stringify(responseData, null, 2)); // Log the response data

//         // res.json(responseData);

//         return responseData; // Return the response data
//     } catch (err) {
//         console.error('Error:', err); // Log the error message
//         res.status(500).json({ error: err.message });
//         return null; // Return null in case of an error
//     }
// };

// module.exports.resourceCount = resourceCount;

const { s3BucketDetails, volumeDetails, describeInstance, lambdaDetails, cloudWatchLogDetails } = require("./resources.services");
const { regionList } = require("../../../config/RegionList");
const AWS = require('../../../config/aws');

const resourceCount = async (req, res) => {
    console.log("inside");
    try {
        const accountIds = process.env.ACCOUNT_IDS.split(',');

        let allResults = await Promise.all(accountIds.map(async (accountId) => {
            let ec2DetailsPromises = regionList.map(region => describeInstance(accountId, region));
            let ebsDetailsPromises = regionList.map(region => volumeDetails(accountId, region));
            let lambdaDetailsPromises = regionList.map(region => lambdaDetails(accountId, region));
            let cloudWatchLogDetailsPromises = regionList.map(region => cloudWatchLogDetails(accountId, region));
            let s3Result = await s3BucketDetails(accountId);

            let [ec2Results, ebsResults, lambdaResults, cloudWatchLogResults] = await Promise.all([
                Promise.all(ec2DetailsPromises),
                Promise.all(ebsDetailsPromises),
                Promise.all(lambdaDetailsPromises),
                Promise.all(cloudWatchLogDetailsPromises)
            ]);

            let ec2TotalCount = ec2Results.reduce((acc, cur) => acc + cur.count, 0);
            let ebsTotalCount = ebsResults.reduce((acc, cur) => acc + cur.count, 0);
            let s3TotalCount = s3Result.count;
            let lambdaTotalCount = lambdaResults.reduce((acc, cur) => acc + cur.count, 0);
            let cloudWatchLogTotalCount = cloudWatchLogResults.reduce((acc, cur) => acc + cur.count, 0);

            let ec2InstancesByRegion = Object.fromEntries(ec2Results.map((result, index) => [regionList[index], result.instances]));
            let ebsVolumesByRegion = Object.fromEntries(ebsResults.map((result, index) => [regionList[index], result.volumes]));
            let lambdaFunctionsByRegion = Object.fromEntries(lambdaResults.map((result, index) => [regionList[index], result.functions]));
            let cloudWatchLogGroupsByRegion = Object.fromEntries(cloudWatchLogResults.map((result, index) => [regionList[index], result.logGroups]));

            return {
                accountId: accountId,
                ec2: { totalCount: ec2TotalCount, details: ec2InstancesByRegion },
                ebs: { totalCount: ebsTotalCount, details: ebsVolumesByRegion },
                s3: { totalCount: s3TotalCount, details: s3Result.buckets },
                lambda: { totalCount: lambdaTotalCount, details: lambdaFunctionsByRegion },
                cloudWatchLogs: { totalCount: cloudWatchLogTotalCount, details: cloudWatchLogGroupsByRegion },
                
            total: ec2TotalCount + ebsTotalCount + s3TotalCount + lambdaTotalCount + cloudWatchLogTotalCount
            // total:ec2TotalCount
            };
        }));

        let totalCounts = allResults.reduce((acc, cur) => {
            acc.ec2 += cur.ec2.totalCount;
            acc.ebs += cur.ebs.totalCount;
            acc.s3 += cur.s3.totalCount;
            acc.lambda += cur.lambda.totalCount;
            acc.cloudWatchLogs += cur.cloudWatchLogs.totalCount;
            return acc;
        }, { ec2: 0, ebs: 0, s3: 0, lambda: 0, cloudWatchLogs: 0 });

        const responseData = {
            totalCounts: {
                ec2: totalCounts.ec2,
                ebs: totalCounts.ebs,
                s3: totalCounts.s3,
                lambda: totalCounts.lambda,
                cloudWatchLogs: totalCounts.cloudWatchLogs,
                total: totalCounts.ec2 + totalCounts.ebs + totalCounts.s3 + totalCounts.lambda + totalCounts.cloudWatchLogs
            },
            accounts: allResults
        };

        console.log('Response Data:', JSON.stringify(responseData, null, 2)); // Log the response data

        res.json(responseData); // Send the response data as JSON
    } catch (err) {
        console.error('Error:', err); // Log the error message
        res.status(500).json({ error: err.message });
    }
};

module.exports.resourceCount = resourceCount;
