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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Cost = mongoose.model('Cost', costSchema);

module.exports = Cost;
