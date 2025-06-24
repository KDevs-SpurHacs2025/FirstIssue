import express from 'express';
import Client from '../models/Client';

const clientIdStore = new Map<string, number>(); // clientId -> expiration time (timestamp)
const CLIENT_ID_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function verifyClientId(req: express.Request, res: express.Response, next: express.NextFunction) {
    const clientId = req.headers['x-client-id'] as string;
    if (!clientId) {
        return res.status(400).json({ error: 'Missing x-client-id header' });
    }
    // Memory first, if not found then check MongoDB
    let expiresAt = clientIdStore.get(clientId);
    if (!expiresAt) {
        const doc = await (Client as any).findOne({ clientId });
        if (doc) {
            expiresAt = doc.expiresAt;
            clientIdStore.set(clientId, expiresAt);
        }
    }
    if (!expiresAt || expiresAt < Date.now()) {
        return res.status(401).json({ error: 'Invalid or expired clientId' });
    }
    next();
}

export { clientIdStore, CLIENT_ID_TTL_MS };
