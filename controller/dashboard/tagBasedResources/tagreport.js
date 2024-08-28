const AWS = require('aws-sdk'); // Import AWS SDK
const { assumeRoleV2 } = require("../../../config/assumeRole");
const { regionList } = require("../../../config/RegionList");

const getTaggedResources = async (req, res) => {
    try {
        let accountResults = []; // To store results for each account
        const accountIds = process.env.ACCOUNT_IDS.split(',');

        for (let accountId of accountIds) {
            let credentials = await assumeRoleV2(accountId);
            let accessKeyId = credentials.Credentials.AccessKeyId;
            let secretAccessKey = credentials.Credentials.SecretAccessKey;
            let sessionToken = credentials.Credentials.SessionToken;

            let awsCredentials = new AWS.Credentials(accessKeyId, secretAccessKey, sessionToken);

            let applicationCount = {}; // Reset application count for each account

            for (const region of regionList) {
                AWS.config.update({
                    region,
                    credentials: awsCredentials
                });

                let resourcegroupstaggingapi = new AWS.ResourceGroupsTaggingAPI(); // Initialize with correct region and credentials

                let params = {
                    TagFilters: [
                        {
                            Key: 'ApplicationName',
                            Values: ['DevOps', 'FinOps', 'Development', 'testing']
                        },
                    ],
                };

                let result;
                do {
                    result = await resourcegroupstaggingapi.getResources(params).promise();
                    result.ResourceTagMappingList.forEach(tagMapping => {
                        let applicationNameTag = tagMapping.Tags.find(tag => tag.Key === 'ApplicationName');
                        let applicationName = applicationNameTag ? applicationNameTag.Value : null;

                        // Increment count for the application name
                        if (applicationName) {
                            if (!applicationCount[applicationName]) {
                                applicationCount[applicationName] = 0;
                            }
                            applicationCount[applicationName]++;
                        }
                    });

                    params.PaginationToken = result.PaginationToken;
                } while (result.PaginationToken);
            }

            let response = {
                AccountId: accountId,
                totalResourceCount: Object.values(applicationCount).reduce((sum, count) => sum + count, 0),
                applicationCount: applicationCount
            };

            accountResults.push(response); // Push result for each account
        }

        console.log(accountResults); // For debugging
        res.json(accountResults); // Return results for all accounts
    } catch (error) {
        console.error("Error getting tagged resources:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getTaggedResources
};

