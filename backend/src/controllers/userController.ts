import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { verifyClientId } from '../middlewares/verifyClientId';
import logger from '../utils/logger';
import OpenSourceSurvey from '../models/OpenSourceSurvey';

// userId issue API (clientId verification required)
export const userController = async (req: express.Request, res: express.Response) : Promise<void> => {
    logger.info('---- Hit GET api/generate/userId Endpoint ----');
    try {
        // Generate a new userId
        const userId = uuidv4();

        // No User model usage, just log
        logger.info(`Generated userId: ${userId}`);

        // Also create an empty OpenSourceSurvey document for this userId
        try {
            await OpenSourceSurvey.create({
                userId,
                reason: '',
                publicRepos: [],
                repoTypes: [],
                well: [],
                like: [],
                wishToLearn: [],
                numOfExperience: 0,
                experiencedUrls: []
            });
            logger.info(`Created empty OpenSourceSurvey for userId: ${userId}`);
        } catch (surveyErr: any) {
            logger.error('Failed to create OpenSourceSurvey for userId:', surveyErr);
            return;
        }

        // Send the generated userId as a response
        res.status(201).json({ userId });
        return;
    } catch (err: any) {
        logger.error('Failed to generate/save userId:', err);
        res.status(500).json({ error: 'Failed to generate userId', detail: err.message });
        return;
    }
};