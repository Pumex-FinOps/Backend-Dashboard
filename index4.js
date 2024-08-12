const AWS = require("./config/aws");
``
AWS.config.update({ region: 'us-east-1' });

const sts = new AWS.STS();

// Assume the role in Account B
const params = {
    RoleArn: 'arn:aws:iam::851725202991:role/TestMultiAccount',
    RoleSessionName: 'MyCustomSessionName'
};

sts.assumeRole(params, (err, data) => {
    if (err) {
        console.log('Error', err);
    } else {
        const credentials = new AWS.Credentials(data.Credentials.AccessKeyId, data.Credentials.SecretAccessKey, data.Credentials.SessionToken);
        console.log("credentials", credentials);

        const s3 = new AWS.S3({ credentials: credentials });

        s3.listBuckets((err, data) => {
            if (err) {
                console.log('Error', err);
            } else {
                console.log('Buckets', data.Buckets);
            }
        });

    }
});
