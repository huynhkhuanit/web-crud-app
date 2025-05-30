const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Auto-update updatedAt field
dataSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

dataSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: new Date() });
    next();
});

module.exports = mongoose.model('Data', dataSchema);