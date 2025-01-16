import { asyncHandler } from '../utils/asyncHandler.js';
import { Post } from '../models/post.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Comment } from "../models/comment.model.js";

const createPost = asyncHandler(async (req, res) => {
    try {
        const { content, isAnonymous } = req.body;

        if (!content?.trim()) {
            throw new ApiError(400, "Post content is required");
        }

        // Log the user information
        console.log("User creating post:", req.user);

        const post = await Post.create({
            content,
            author: req.user._id,
            isAnonymous: isAnonymous || false
        });

        // Populate the author details
        const populatedPost = await Post.findById(post._id)
            .populate('author', 'fullName avatar')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'fullName avatar'
                }
            });

        return res.status(201).json(
            new ApiResponse(201, populatedPost, "Post created successfully")
        );
    } catch (error) {
        console.error("Post creation error:", error);
        throw new ApiError(
            error.statusCode || 500,
            error.message || "Error while creating post"
        );
    }
});

const getPosts = asyncHandler(async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'fullName avatar')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'fullName avatar'
                }
            })
            .sort({ createdAt: -1 });

        return res.status(200).json(
            new ApiResponse(200, posts, "Posts fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Error while fetching posts");
    }
});

const likePost = asyncHandler(async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        if (!postId) {
            throw new ApiError(400, "Post ID is required");
        }

        const post = await Post.findById(postId);
        if (!post) {
            throw new ApiError(404, "Post not found");
        }

        const likeIndex = post.likes.indexOf(userId);
        if (likeIndex === -1) {
            post.likes.push(userId);
        } else {
            post.likes.splice(likeIndex, 1);
        }

        await post.save();

        const updatedPost = await Post.findById(postId)
            .populate('author', 'fullName avatar')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'fullName avatar'
                }
            });

        return res.status(200).json(
            new ApiResponse(200, updatedPost, "Post like status updated successfully")
        );
    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message || "Error while updating like status");
    }
});

const addComment = asyncHandler(async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;

        if (!content?.trim()) {
            throw new ApiError(400, "Comment content is required");
        }

        const post = await Post.findById(postId);
        if (!post) {
            throw new ApiError(404, "Post not found");
        }

        const comment = await Comment.create({
            content,
            author: req.user._id,
            post: postId
        });

        post.comments.push(comment._id);
        await post.save();

        const populatedComment = await Comment.findById(comment._id)
            .populate('author', 'fullName avatar');

        return res.status(201).json(
            new ApiResponse(201, populatedComment, "Comment added successfully")
        );
    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message || "Error while adding comment");
    }
});

const deletePost = asyncHandler(async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) {
            throw new ApiError(404, "Post not found");
        }

        if (post.author.toString() !== userId.toString()) {
            throw new ApiError(403, "Unauthorized to delete this post");
        }

        await Post.findByIdAndDelete(postId);
        await Comment.deleteMany({ post: postId });

        return res.status(200).json(
            new ApiResponse(200, null, "Post deleted successfully")
        );
    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message || "Error while deleting post");
    }
});

export {
    createPost,
    getPosts,
    likePost,
    addComment,
    deletePost
}; 