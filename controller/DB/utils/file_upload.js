const aws = require('../../../config/aws');

const s3 = new aws.S3();

async function fileUpload(req, res) {

    try {
        const { originalname, buffer } = req.file;
        console.log(req.file);
        const params = {
            Bucket: "arnodebucket/CloudDashboard",
            ACL: "public-read",
            ContentType: req.file.mimetype,
            Key: originalname,
            Body: buffer
        };

        const uploadedFile = await s3.upload(params).promise();
        const params1 = {
            Image: uploadedFile.Location
        };

        console.log(uploadedFile.Location);

        res.status(200).send({
            message: "File uploaded successfully",
            data: {
                pimage: uploadedFile.Location
            }
        });

    } catch (err) {
        console.error('File upload failed:', err);
        res.status(500).send({
            message: "File upload failed",
            error: err.message
        });
    }
}

module.exports = { fileUpload };
