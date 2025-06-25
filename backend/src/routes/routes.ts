import { Router } from 'express';
import type { Request, Response } from 'express';
import { userController } from '../controllers/userController.js';
import { getOpenSourceRecommendations } from '../controllers/orController.js';
import { chatbotController } from '../controllers/chatbotController.js'; // <--- 이 라인 추가

const router = Router();

router.get('/generate/userId', userController);

router.post('/generate/recommendations', getOpenSourceRecommendations);

router.post('/chatbot/message', chatbotController); // <--- 이 라인 추가

export default router;