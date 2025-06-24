import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import logger from '../utils/logger'; // Assuming you have this logger utility

// Load environment variables (dotenv will look for .env in the current working directory)
dotenv.config();

// Debug: Check if environment variables are loaded
logger.info('Environment variables debug:', {
    PORT: process.env.PORT,
    GEMINI_API_KEY_LENGTH: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 'undefined',
    NODE_ENV: process.env.NODE_ENV
});

const apiKey = process.env.GEMINI_API_KEY; // Get API key from environment variables

if (!apiKey) {
    logger.error('GEMINI_API_KEY is not set in environment variables for chatbotController. Please set it in your .env file or environment variables.');
}
else {
    logger.info('GEMINI_API_KEY is set for chatbotController.');    
}


// Initialize GoogleGenerativeAI with the API key if available
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const chatbotController = async (req: Request, res: Response): Promise<void> => {
    logger.info('---- POST /api/chatbot/message Endpoint Hit ----');

    const { message } = req.body;

    if (!message) {
        logger.warn('Missing message in chatbot request body.');
        res.status(400).json({ success: false, error: 'Message is required.' });
        return;
    }

    if (!genAI) {
        logger.error('Gemini API key is not configured, cannot process chatbot request.');
        res.status(500).json({ success: false, error: 'Chatbot service not configured due to missing API key.' });
        return;
    }

    try {
        // 사용할 Gemini 모델을 지정합니다. (gemini-pro 또는 gemini-flash)
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
        // 간단한 단일 턴 챗봇이므로 이전 대화 기록은 저장하지 않습니다.
        // 만약 대화 기록을 유지하고 싶다면, 이곳에 history 배열을 관리하는 로직이 필요합니다.
        const chat = model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 200, // AI 응답의 최대 길이
            },
        });

        logger.info(`Sending message to Gemini: "${message}"`);
        const result = await chat.sendMessage(message);
        const responseText = result.response.text();
        logger.info(`Received response from Gemini: "${responseText}"`);

        res.status(200).json({ success: true, response: responseText });
    } catch (error: any) {
        logger.error('Error processing chatbot message with Gemini:', error); // <-- error.message 대신 error 객체 전체를 로깅
        res.status(500).json({ success: false, error: 'Failed to get response from AI.', detail: error.message || String(error) });
    }
};