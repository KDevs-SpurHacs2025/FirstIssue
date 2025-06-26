import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import logger from '../utils/logger.js'; // Assuming you have this logger utility
import Recommendation from '../models/Recommendation.js';
import RepoAnalysisResult from '../models/RepoAnalysisResult.js';
import OpenSourceSurvey from '../models/OpenSourceSurvey.js';

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
    
    const { message, userId, rank } = req.body;

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
        // 1. 이전 추천, 분석 결과, 설문조사 결과 조회 (userId, rank가 모두 있을 때만)
        let prevRecommendation = null;
        let repoAnalyses: any[] = [];
        let userSurvey = null;
        if (userId && rank !== undefined) {
            prevRecommendation = await Recommendation.findOne({ userId, Rank: rank });
            repoAnalyses = await RepoAnalysisResult.find({ userId });
            userSurvey = await OpenSourceSurvey.findOne({ userId });
        }
        logger.info(`Previous recommendation for userId ${userId} and rank ${rank}:`, prevRecommendation);
        logger.info(`Previous repo analyses for userId ${userId}:`, repoAnalyses);
        logger.info(`OpenSourceSurvey for userId ${userId}:`, userSurvey);

        // 2. AI 프롬프트에 맥락 포함
        let contextPrompt = '';
        if (prevRecommendation) {
            contextPrompt += `User's previous recommendation for Rank ${rank}:\n${JSON.stringify(prevRecommendation, null, 2)}\n`;
        }
        if (repoAnalyses && repoAnalyses.length > 0) {
            contextPrompt += `User's repo analysis results:\n${JSON.stringify(repoAnalyses, null, 2)}\n`;
        }
        if (userSurvey) {
            contextPrompt += `User's open source survey responses:\n${JSON.stringify(userSurvey, null, 2)}\n`;
        }
        if (contextPrompt) {
            contextPrompt += '\nBased on this context, continue the conversation below.\n';
        }

        // 사용할 Gemini 모델을 지정합니다. (gemini-pro 또는 gemini-flash)
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
        const chat = model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 200, // AI 응답의 최대 길이
            },
        });

        // contextPrompt와 사용자의 message를 합쳐서 보냄
        const fullPrompt = contextPrompt ? `${contextPrompt}\nUser: ${message}` : message;

        logger.info(`Sending message to Gemini: "${fullPrompt}"`);
        const result = await chat.sendMessage(fullPrompt);
        const responseText = result.response.text();
        logger.info(`Received response from Gemini: "${responseText}"`);

        res.status(200).json({ success: true, response: responseText });
    } catch (error: any) {
        logger.error('Error processing chatbot message with Gemini:', error);
        res.status(500).json({ success: false, error: 'Failed to get response from AI.', detail: error.message || String(error) });
    }
};