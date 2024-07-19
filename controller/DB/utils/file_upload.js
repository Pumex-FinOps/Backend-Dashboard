const aws = require('../../../config/aws')

const s3 = new aws.S3()

async function fileUpload(req, res) {
    console.log(req.body)
    try {
        const { originalname, buffer } = req.file;
        //console.log(buffer)
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
        }



        console.log(uploadedFile.Location)
        res.send({
            message: "fileUpload successfully",
            data: {
                pimage: uploadedFile.Location
            }
        })
        // console.log(params1);
        // console.log(result);



    } catch (err) {
        console.log(err)
        res.send(err)
    }

}

module.exports.fileUpload = fileUpload;