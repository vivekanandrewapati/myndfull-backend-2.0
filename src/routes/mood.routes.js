import { Router } from 'express';
import { createMoodEntry, getMoodHistory, deleteMoodEntry } from '../controllers/mood.controller.js';
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/', verifyJWT, createMoodEntry);
router.get('/history', verifyJWT, getMoodHistory);
router.delete('/:id', verifyJWT, deleteMoodEntry);

export default router; 