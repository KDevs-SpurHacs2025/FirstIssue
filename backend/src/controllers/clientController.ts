import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Client from '../models/Client';
import { clientIdStore, CLIENT_ID_TTL_MS } from '../middlewares/verifyClientId';
import logger from '../utils/logger';

// clientId issue API
export const issueClientId = async (req: express.Request, res: express.Response) => {
    const clientId = uuidv4();
    const expiresAt = Date.now() + CLIENT_ID_TTL_MS;
    clientIdStore.set(clientId, expiresAt);
    // Also save to MongoDB
    try {
        const client = new Client({ clientId, expiresAt });
        await client.save();
    } catch (err) {
        logger.error('Failed to save clientId to MongoDB:', err);
    }
    res.json({ clientId, expiresAt });
};

