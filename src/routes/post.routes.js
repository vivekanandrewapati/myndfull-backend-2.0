import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
    createPost,
    getPosts,
    likePost,
    addComment,
    deletePost
} from '../controllers/post.controller.js';

const router = Router();

// Apply auth middleware to all routes
router.use(verifyJWT);

// Base routes
router.route("/")
    .post(createPost)
    .get(getPosts);

// Like route - changed to match frontend request
router.post("/:postId/like", likePost);

router.route("/:postId/comments")
    .post(addComment);

router.route("/:postId")
    .delete(deletePost);

export default router; 