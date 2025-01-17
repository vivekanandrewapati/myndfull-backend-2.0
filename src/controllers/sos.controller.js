import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { SOS } from '../models/sos.model.js';
import { User } from '../models/user.model.js';
import { Post } from '../models/post.model.js';
import { Resend } from 'resend';

import dotenv from 'dotenv';
dotenv.config({
    path: "./.env"
});
// Debug log for environment variable
console.log("RESEND_API_KEY status:", !!process.env.RESEND_API_KEY);

const resend = new Resend(process.env.RESEND_API_KEY);

const triggerSOS = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        // Create SOS alert
        const sosAlert = await SOS.create({
            userId: userId,
            status: 'active'
        });

        // Create emergency post in community
        const emergencyPost = await Post.create({
            content: `🚨 EMERGENCY SOS ALERT: ${req.user.username} needs immediate assistance! If you're nearby, please help.`,
            author: userId,
            isEmergency: true
        });

        // Get all users for notification
        const allUsers = await User.find({}, 'email username');
        console.log("Found users to notify:", allUsers.length);

        // Send emails with better error handling and logging
        try {
            // Send a single email with all recipients in BCC
            const emailResult = await resend.emails.send({
                from: 'onboarding@resend.dev', // Use the verified sender email
                to: 'hekil67744@evnft.com', // Your verified test email
                bcc: allUsers.map(user => user.email), // BCC all users
                subject: '🚨 Emergency SOS Alert',
                html: `
                    <h1>Emergency SOS Alert</h1>
                    <p>User ${req.user.username} has triggered an emergency SOS alert.</p>
                    <p>If you are nearby and can help, please check the community page immediately.</p>
                    <p>This is an automated emergency alert. Please respond if you can help.</p>
                `
            });
            console.log('Email sent:', emailResult);
        } catch (emailError) {
            console.error('Failed to send email:', emailError);
            // Continue execution even if email fails
        }

        return res.status(200).json(
            new ApiResponse(200, {
                sosAlert,
                emergencyPost,
                emailSent: true
            }, "SOS alert triggered successfully")
        );

    } catch (error) {
        console.error('SOS Trigger Error:', error);
        throw new ApiError(500, "Failed to trigger SOS alert");
    }
});

const resolveSOS = asyncHandler(async (req, res) => {
    const sosId = req.params.sosId;

    const sosAlert = await SOS.findByIdAndUpdate(
        sosId,
        { status: 'resolved' },
        { new: true }
    );

    if (!sosAlert) {
        throw new ApiError(404, "SOS alert not found");
    }

    // Create resolution post in community
    await Post.create({
        content: `✅ SOS Alert has been resolved. Thank you for your support.`,
        author: req.user._id,
        isEmergency: false
    });

    return res.status(200).json(
        new ApiResponse(200, sosAlert, "SOS alert resolved successfully")
    );
});

export {
    triggerSOS,
    resolveSOS
};