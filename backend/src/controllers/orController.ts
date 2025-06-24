import { Request, Response } from 'express';
import { analyzeUserOpenSourceProfile } from '../services/geminiService';
import logger from '../utils/logger';
import OpenSourceSurvey from '../models/OpenSourceSurvey';

// Extract required fields from the schema dynamically
const REQUIRED_FIELDS = Object.keys(OpenSourceSurvey.schema.paths).filter(
  key => !['_id', 'createdAt', 'updatedAt', '__v'].includes(key)
);

export const getOpenSourceRecommendations = async (req: Request, res: Response): Promise<void> => {
    logger.info('---- POST /api/generate/recommendations Endpoint Hit ----');

    // Validate userId from query parameters
    const userId = req.body.userId as string;
    if (!userId) {
        logger.warn('Missing userId in body');
        res.status(400).json({ success: false, error: 'Missing userId in body' });
        return;
    }

    try {
        const answers = req.body;
        // Check for missing required fields based on the model
        const missingFields = REQUIRED_FIELDS.filter(field =>
          answers[field] === undefined || answers[field] === null
        );
        if (missingFields.length > 0) {
            logger.warn('Missing required fields:', missingFields);
            res.status(400).json({
                success: false,
                error: 'Missing required fields',
                missingFields
            });
            return;
        }
        
        // Generate recommendations using the Gemini service
        const result = await analyzeUserOpenSourceProfile(answers);
        if (!result) {
            logger.error('No result returned from analyzeUserOpenSourceProfile');
            res.status(500).json({ success: false, error: 'No result returned from analysis service' });
            return;
        }
        logger.info('Open source profile analysis result:', result);

        // Save survey to DB (upsert to avoid duplicate userId error)
        try {
            await OpenSourceSurvey.updateOne(
                { userId },
                { $set: { ...answers, userId } },
                { upsert: true }
            );
            logger.info('Survey data upserted to DB');
        } catch (dbErr: any) {
            logger.error('Failed to save survey data:', dbErr);
            // Continue processing even if DB save fails
        }

        if (!result) {
            logger.error('Error analyzing user open source profile:', result);
            res.status(500).json({ success: false, ...result });
            return;
        }
        res.status(200).json({ success: true, recommendations: result });
    } catch (err: any) {
        logger.error('Error occurred while processing request:', err);
        res.status(500).json({ success: false, error: 'Internal server error', detail: err.message });
    }
}
