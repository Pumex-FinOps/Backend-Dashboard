const AWS = require("../../../config/aws");
const { regionList } = require("../../../config/RegionList");

const getTaggedResources = async (req, res) => {
    try {
        let applicationCount = {};

        for (const region of regionList) {
            AWS.config.update({ region });

            var resourcegroupstaggingapi = new AWS.ResourceGroupsTaggingAPI();

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
            totalResourceCount: Object.values(applicationCount).reduce((sum, count) => sum + count, 0),
            applicationCount: applicationCount
        };

        console.log(response); // For debugging
        res.json(response);
    } catch (error) {
        console.error("Error getting tagged resources:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getTaggedResources
};
