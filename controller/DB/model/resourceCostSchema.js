
const mongoose = require('mongoose');
const { Schema } = mongoose;

const resourceCostSchema = new Schema({
    data: {
        type: Schema.Types.Mixed,
        required: true
    },
    
}, {
    timestamps: true
});

const ResourceCost = mongoose.model('ResourceCosts', resourceCostSchema);

module.exports = ResourceCost;
