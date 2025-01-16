import mongoose from 'mongoose';

const sosSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'resolved'],
        default: 'active'
    },

}, { timestamps: true });

export const SOS = mongoose.model('SOS', sosSchema);

