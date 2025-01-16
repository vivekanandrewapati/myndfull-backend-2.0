import { asyncHandler } from '../utils/asyncHandler.js';
import { Chat } from '../models/chat.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const saveMessage = asyncHandler(async (req, res) => {
    const { role, content } = req.body;

    if (!content || !role) {
        throw new ApiError(400, "Message content and role are required");
    }

    let chatSession = await Chat.findOne({
        user: req.user._id,
        sessionStart: {
            $gte: new Date(Date.now() - 15 * 60 * 1000) // Last 15 minutes
        }
    });

    if (!chatSession) {
        chatSession = await Chat.create({
            user: req.user._id,
            messages: []
        });
    }

    chatSession.messages.push({ role, content });
    await chatSession.save();

    return res.status(200).json(
        new ApiResponse(200, chatSession.messages, "Message saved successfully")
    );
});

const getChatHistory = asyncHandler(async (req, res) => {
    const chatHistory = await Chat.findOne({
        user: req.user._id,
        sessionStart: {
            $gte: new Date(Date.now() - 15 * 60 * 1000) // Last 15 minutes
        }
    });

    return res.status(200).json(
        new ApiResponse(200, chatHistory?.messages || [], "Chat history fetched successfully")
    );
});

export {
    saveMessage,
    getChatHistory
}; 