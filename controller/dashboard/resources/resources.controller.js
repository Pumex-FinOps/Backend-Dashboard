const {s3BucketDetails,volumeDetails,describeInstance}= require("./resources.services")
const {regionList} = require("../../../config/RegionList")

const resourceCount = async  (req, res) => {
    try {
        let ec2DetailsPromises = regionList.map(region => describeInstance(region));
        let ebsDetailsPromises = regionList.map(region => volumeDetails(region));

        let [ec2Results, ebsResults, s3Result] = await Promise.all([
            Promise.all(ec2DetailsPromises),
            Promise.all(ebsDetailsPromises),
            s3BucketDetails()
        ]);

        let ec2TotalCount = ec2Results.reduce((acc, cur) => acc + cur.count, 0);
        let ebsTotalCount = ebsResults.reduce((acc, cur) => acc + cur.count, 0);
        let s3TotalCount = s3Result.count;

        let ec2ArnsByRegion = Object.fromEntries(ec2Results.map((result, index) => [regionList[index], result.arns]));
        let ebsArnsByRegion = Object.fromEntries(ebsResults.map((result, index) => [regionList[index], result.arns]));

        res.json({
            ec2: { totalCount: ec2TotalCount, arnsByRegion: ec2ArnsByRegion },
            ebs: { totalCount: ebsTotalCount, arnsByRegion: ebsArnsByRegion },
            s3: { totalCount: s3TotalCount }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports.resourceCount= resourceCount
