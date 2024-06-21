const AWS = require("../../../config/aws");
const { regionList } = require("../../../config/RegionList");

const getTaggedResources = async (req, res) => {
    try {
        const applicationName = req.params.applicationName || 'FinOps'; // Default to 'FinOps' if not provided
        let allResources = [];

        for (const region of regionList) {
            AWS.config.update({ region });

            var resourcegroupstaggingapi = new AWS.ResourceGroupsTaggingAPI();

            let params = {
                TagFilters: [
                    {
                        Key: 'ApplicationName',
                        Values: [applicationName],
                    },
                ],
            };

            let result;
            do {
                result = await resourcegroupstaggingapi.getResources(params).promise();
                let resources = result.ResourceTagMappingList.map(tagMapping => {
                    let applicationNameTag = tagMapping.Tags.find(tag => tag.Key === 'ApplicationName');
                    return {
                        ResourceARN: tagMapping.ResourceARN,
                        ApplicationName: applicationNameTag ? applicationNameTag.Value : null
                    };
                });

                allResources = allResources.concat(resources);

                params.PaginationToken = result.PaginationToken;
            } while (result.PaginationToken);
        }

        let response = {
            resourceCount: allResources.length,
            resources: allResources
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
