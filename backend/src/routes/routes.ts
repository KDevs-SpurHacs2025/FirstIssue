import { Router } from 'express';
import type { Request, Response } from 'express';
import { userController } from '../controllers/userController';
import { getOpenSourceRecommendations } from '../controllers/orController';
import { chatbotController } from '../controllers/chatbotController'; // <--- 이 라인 추가

const router = Router();

router.get('/generate/userId', userController);

router.post('/generate/recommendations', getOpenSourceRecommendations);

router.post('/chatbot/message', chatbotController); // <--- 이 라인 추가

export default router;