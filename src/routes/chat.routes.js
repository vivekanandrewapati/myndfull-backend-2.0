import { Router } from 'express';
import { saveMessage, getChatHistory } from '../controllers/chat.controller.js';
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.post('/message', verifyJWT, saveMessage);
router.get('/history', verifyJWT, getChatHistory);

export default router; 