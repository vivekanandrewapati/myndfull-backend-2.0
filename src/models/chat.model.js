import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messages: [{
        role: {
            type: String,
            enum: ['user', 'assistant'],
            required: true
        },
        content: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now,
            expires: 900 // 15 minutes in seconds (15 * 60)
        }
    }],
    sessionStart: {
        type: Date,
        default: Date.now,
        expires: 900 // 15 minutes TTL
    }
});

// Index for TTL
chatSchema.index({ sessionStart: 1 }, { expireAfterSeconds: 900 });

export const Chat = mongoose.model("Chat", chatSchema); 