import { Request, Response } from 'express';
import { analyzeUserOpenSourceProfile, OpenSourceRecommendation, analyzeGitRepoProfile } from '../services/geminiService.js';
import logger from '../utils/logger.js';
import OpenSourceSurvey from '../models/OpenSourceSurvey.js';
import RepoAnalysisResult from '../models/RepoAnalysisResult.js';
import Recommendation, { mapRecommendationFields } from '../models/Recommendation.js';


// Extract required fields from the schema dynamically
const REQUIRED_FIELDS = Object.keys(OpenSourceSurvey.schema.paths).filter(
  key => !['_id', 'createdAt', 'updatedAt', '__v', 'recommendations'].includes(key)
);

export const getOpenSourceRecommendations = async (req: Request, res: Response): Promise<void> => {
    logger.info('---- POST /api/generate/recommendations Endpoint Hit ----');

    // Validate userId from body parameters
    const userId = req.body.userId as string;
    if (!userId) {
        logger.warn('Missing userId in body');
        res.status(400).json({ success: false, error: 'Missing userId in body' });
        return;
    }

    // Check wheter the userId exists in OpenSourceSurvey collection
    const existingSurvey = await OpenSourceSurvey.findOne({ userId });
    if (!existingSurvey) {
        logger.warn(`userId ${userId} not found in OpenSourceSurvey collection`);
        res.status(404).json({ success: false, error: 'userId not found in survey records' });
        return;
    }

    try {
        const answers = req.body;
        // Check for missing required fields based on the model (excluding generated fields)
        const missingFields = REQUIRED_FIELDS.filter(field =>
          answers[field] === undefined || answers[field] === null || answers[field] === '' // Consider empty strings as missing for string fields
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
        
        // Call analyzeGitRepoProfile for each repo URL and type
        const repoUrls: string[] = answers.publicRepos || [];
        const repoTypes: string[] = answers.repoTypes || [];
        const repoAnalyses = await Promise.all(
            repoUrls.map((url, idx) => analyzeGitRepoProfile(url, repoTypes[idx] || 'N/A'))
        );
        if (!repoAnalyses) {
            logger.error('Failed to analyze repositories');
            res.status(500).json({ success: false, error: 'Failed to analyze repositories' });
            return;
        }
        logger.info('Repository analyses completed successfully:', repoAnalyses);

        // import RepoAnalysisResult model
        if (repoAnalyses && repoAnalyses.length > 0) {
            const bulkOps = repoAnalyses.map((analysis, idx) => ({
                updateOne: {
                    filter: { userId, repoUrl: analysis.repoUrl },
                    update: { $set: { ...analysis, userId } },
                    upsert: true
                }
            }));
            try {
                await RepoAnalysisResult.bulkWrite(bulkOps);
                logger.info('Repo analysis results upserted to RepoAnalysisResult collection');
            } catch (repoDbErr: any) {
                logger.error('Failed to upsert repo analysis results:', repoDbErr);
            }
        }

        // Analyze the user's open source profile using the answers and repo analyses
        const result = await analyzeUserOpenSourceProfile(answers, repoAnalyses);
        
        // If analyzeUserOpenSourceProfile returned an error object, handle it
        if ('error' in result && result.error) {
            logger.error('Error from analyzeUserOpenSourceProfile:', result.detail || result.error, result.rawResponse);
            res.status(500).json({ success: false, error: result.error, detail: result.detail });
            return;
        }

        // At this point, TypeScript knows 'result' is of type { success: true; recommendations: OpenSourceRecommendation[] }
        // So, we can safely access result.recommendations without a type assertion.
        const recommendations = (result as { success: boolean; recommendations: OpenSourceRecommendation[] }).recommendations; 

        logger.info('Open source recommendations generated successfully.');

        // Save only survey data to DB (no recommendations field)
        try {
            await OpenSourceSurvey.updateOne(
                { userId },
                { $set: { ...answers, userId } },
                { upsert: true }
            );
            logger.info('Survey data upserted to DB');
        } catch (dbErr: any) {
            logger.error('Failed to save survey data to DB:', dbErr);
        }

        // Save recommendations to Recommendation collection (bulk upsert)
        if (recommendations && recommendations.length > 0) {
            const recBulkOps = (recommendations as any[]).map((rec) => ({
                updateOne: {
                    filter: { userId, RepoURL: rec["Repo URL"] },
                    update: { $set: { ...mapRecommendationFields(rec), userId } },
                    upsert: true
                }
            }));
            try {
                await Recommendation.bulkWrite(recBulkOps);
                logger.info('Recommendations upserted to Recommendation collection');
            } catch (recDbErr: any) {
                logger.error('Failed to upsert recommendations:', recDbErr);
            }
        }


        // Return success response and recommendations to the client
        res.status(200).json({ success: true, recommendations: recommendations });

    } catch (err: any) {
        logger.error('Error occurred while processing recommendation request:', err);
        res.status(500).json({ success: false, error: 'Internal server error', detail: err.message });
    }
}