import mongoose from "mongoose";

const moodSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mood: {
        type: String,
        required: true,
        enum: ['Happy', 'Peaceful', 'Neutral', 'Sad', 'Angry', 'Anxious', 'Tired', 'Confused']
    },
    journal: {
        type: String
    },
    gratitude: {
        type: String
    },
    goals: {
        type: String
    }
}, { timestamps: true });

export const Mood = mongoose.model("Mood", moodSchema); 