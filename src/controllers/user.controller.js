import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/Cloudinary.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const refreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken();

        user.refreshToken = refreshToken;
        await user.save(({ validateBeforeSave: false }));

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // 1. Get user details
    const { fullName, username, email, password } = req.body;

    // 2. Validation
    if (!fullName?.trim() || !username?.trim() || !email?.trim() || !password?.trim()) {
        throw new ApiError(400, "All fields are required");
    }

    // 3. Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // 4. Create user object
    const userData = {
        fullName,
        email,
        username: username.toLowerCase(),
        password
    };

    // 5. Handle avatar upload if present
    if (req.file?.path) {
        try {
            const avatarUrl = await uploadOnCloudinary(req.file.path);
            if (avatarUrl) {
                userData.avatar = avatarUrl;
            }
        } catch (error) {
            console.error("Avatar upload failed:", error);
            // Continue without avatar if upload fails
        }
    }

    // 6. Create user in database
    const user = await User.create(userData);

    // 7. Remove sensitive fields and send response
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Error while registering user");
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});

const loginUser = asyncHandler(async (req, res) => {

    const { email, username, password } = req.body;

    // if (!username && !email) {
    //     throw new ApiError(400, "Please provide either username or email")
    // }

    if (!email) {
        throw new ApiError(400, "Please provide email")
    }

    const user = await User.findOne({ email });
    // const user = await User.findOne({
    //     $or: [{ username }, { email }]
    // })

    if (!user) {
        throw new ApiError(400, "user not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        )


})

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }



    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(400, "unauthorized access");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET


        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(400, "ivalid refresh token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")

        }
        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken, refreshToken: newRefreshToken
                    },
                    "Access token refreshed"
                )
            )
    }

    catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

// const changeCurrentPassword = asyncHandler(async (req, res) => {

//     const { oldPassword, newPassword } = req.body;

//     const user = await User.findById(req.user?._id);

//     const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

//     if (!isPasswordCorrect) {
//         throw new ApiError(200, "incoorect old passowrd");
//     }

//     user.password = newPassword;
//     await user.save({ validateBeforeSave: true })

//     return res
//         .status(200)
//         .json(
//             new ApiResponse(200, {}, "password changed sucessfully")
//         )

// })

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                req.user,

                "user fetched successfully"
            )
        )
})





const updateUserProfile = asyncHandler(async (req, res) => {
    try {
        const { fullName, location } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            throw new ApiError(401, "Unauthorized request");
        }

        const updateFields = {
            ...(fullName && { fullName }),
            ...(location && { location })
        };

        // Handle avatar upload if file exists
        if (req.file) {
            const avatarLocalPath = req.file.path;

            // Upload to Cloudinary
            const avatar = await uploadOnCloudinary(avatarLocalPath);

            if (avatar?.url) {
                updateFields.avatar = avatar.url;
            }
        }

        const user = await User.findByIdAndUpdate(
            userId,
            updateFields,
            { new: true }
        ).select("-password -refreshToken");

        return res.status(200).json(
            new ApiResponse(
                200,
                user,
                "Profile updated successfully"
            )
        );

    } catch (error) {
        console.error("Profile update error:", error);
        throw new ApiError(
            error.statusCode || 500,
            error.message || "Error updating profile"
        );
    }
});




export {
    registerUser,
    loginUser,
    getCurrentUser,
    updateUserProfile,
    logoutUser,
    refreshAccessToken
}