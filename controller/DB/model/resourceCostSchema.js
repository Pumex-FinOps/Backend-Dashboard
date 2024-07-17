
const mongoose = require('mongoose');
const { Schema } = mongoose;

const resourceCostSchema = new Schema({
    data: {
        type: Schema.Types.Mixed,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ResourceCost = mongoose.model('ResourceCosts', resourceCostSchema);

module.exports = ResourceCost;
