const { CloudWatch } = require('aws-sdk');
const mongoose = require('mongoose');
const costSchema = new mongoose.Schema({
    yearly: {
        Total: { type: Number, },
        ec2: { type: Number, },
        s3: { type: Number, },
        lambda: { type: Number },
        ebs: { type: Number }
    },
    currentMonth: {
        Total: { type: Number, },
        ec2: { type: Number, },
        s3: { type: Number, },
        lambda: { type: Number },
        ebs: { type: Number }
    },
    preivousMonth: {
        Total: { type: Number, },
        ec2: { type: Number, },
        s3: { type: Number, },
        lambda: { type: Number },
        ebs: { type: Number }
    },
    resourceCount: {
        ec2: { totalCount: { type: Number, } },
        ebs: { totalCount: { type: Number, } },
        s3: { totalCount: { type: Number, } },
        lambda: { totalCount: { type: Number, } },
        CloudWatch: { totalCount: { type: Number, } },
        total: { type: Number }
    }
}, {
    timestamps: true
});

const Cost = mongoose.model('Cost', costSchema);

module.exports = Cost;
