import { asyncHandler } from '../utils/asyncHandler.js';
import { Mood } from '../models/mood.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const createMoodEntry = asyncHandler(async (req, res) => {
    const { mood, journal, gratitude, goals } = req.body;

    if (!mood) {
        throw new ApiError(400, "Mood is required");
    }

    const moodEntry = await Mood.create({
        user: req.user._id,
        mood,
        journal,
        gratitude,
        goals
    });

    return res.status(201).json(
        new ApiResponse(201, moodEntry, "Mood entry created successfully")
    );
});

const getMoodHistory = asyncHandler(async (req, res) => {
    const moodHistory = await Mood.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(10);

    return res.status(200).json(
        new ApiResponse(200, moodHistory, "Mood history fetched successfully")
    );
});

const deleteMoodEntry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await Mood.findByIdAndDelete(id);
    return res.status(200).json(new ApiResponse(200, null, "Mood entry deleted successfully"));
});

export {
    createMoodEntry,
    getMoodHistory,
    deleteMoodEntry
}; 