const mongoose = require('mongoose');
const { Schema } = mongoose;

const costSchema = new Schema({
    accountId: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        //required: true
    },
    data: {
        type: Schema.Types.Mixed,
        required: true
    },
}, {
    timestamps: true
});

const Cost = mongoose.model('Cost', costSchema);

module.exports = Cost;
