const { s3BucketDetails, volumeDetails, describeInstance, lambdaDetails, cloudWatchLogDetails } = require("./resources.services");
const { regionList } = require("../../../config/RegionList");

const resourceCount = async (req, res) => {
    try {
        let ec2DetailsPromises = regionList.map(region => describeInstance(region));
        let ebsDetailsPromises = regionList.map(region => volumeDetails(region));
        let lambdaDetailsPromises = regionList.map(region => lambdaDetails(region));
        let cloudWatchLogDetailsPromises = regionList.map(region => cloudWatchLogDetails(region));

        let [ec2Results, ebsResults, s3Result, lambdaResults, cloudWatchLogResults] = await Promise.all([
            Promise.all(ec2DetailsPromises),
            Promise.all(ebsDetailsPromises),
            s3BucketDetails(),
            Promise.all(lambdaDetailsPromises),
            Promise.all(cloudWatchLogDetailsPromises)
        ]);

        let ec2TotalCount = ec2Results.reduce((acc, cur) => acc + cur.count, 0);
        let ebsTotalCount = ebsResults.reduce((acc, cur) => acc + cur.count, 0);
        let s3TotalCount = s3Result.count;
        let lambdaTotalCount = lambdaResults.reduce((acc, cur) => acc + cur.count, 0);
        let cloudWatchLogTotalCount = cloudWatchLogResults.reduce((acc, cur) => acc + cur.count, 0);

        let ec2ArnsByRegion = Object.fromEntries(ec2Results.map((result, index) => [regionList[index], result.arns]));
        let ebsArnsByRegion = Object.fromEntries(ebsResults.map((result, index) => [regionList[index], result.arns]));
        let lambdaArnsByRegion = Object.fromEntries(lambdaResults.map((result, index) => [regionList[index], result.arns]));
        let cloudWatchLogArnsByRegion = Object.fromEntries(cloudWatchLogResults.map((result, index) => [regionList[index], result.arns]));

        return({
            ec2: { totalCount: ec2TotalCount, arnsByRegion: ec2ArnsByRegion },
            ebs: { totalCount: ebsTotalCount, arnsByRegion: ebsArnsByRegion },
            s3: { totalCount: s3TotalCount },
            lambda: { totalCount: lambdaTotalCount, arnsByRegion: lambdaArnsByRegion },
            cloudWatchLogs: { totalCount: cloudWatchLogTotalCount, arnsByRegion: cloudWatchLogArnsByRegion },
            total: ec2TotalCount + ebsTotalCount + s3TotalCount + lambdaTotalCount + cloudWatchLogTotalCount
        });
    } catch (err) {
        //res.status(500).json({ error: err.message });
    }
};

module.exports.resourceCount = resourceCount;
