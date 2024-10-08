const mongoose = require('mongoose');
const { Schema } = mongoose;

const resourceCountSchema = new Schema({
    accountId: {
        type: String,
        required: true
    },
    data: {
        type: Schema.Types.Mixed,
        required: true
    },
}, {
    timestamps: true
});

const resourceCount = mongoose.model('resourceCountDetails', resourceCountSchema);

module.exports = resourceCount;
