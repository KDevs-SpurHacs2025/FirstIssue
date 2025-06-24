import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import Client from '../models/Client';
import { clientIdStore, CLIENT_ID_TTL_MS } from '../middlewares/verifyClientId';
import logger from '../utils/logger';

// WebSocket server creation function
export function createClientIdWebSocketServer(server: any) {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws: WebSocket) => {
        logger.info('WebSocket client connected');
        // Issue and send clientId immediately when a new client connects
        sendNewClientId(ws);
        // Issue and send clientId every hour
        const interval = setInterval(() => {
            sendNewClientId(ws);
        }, CLIENT_ID_TTL_MS);

        ws.on('close', () => {
            clearInterval(interval);
            logger.info('WebSocket client disconnected');
        });
    });
}

async function sendNewClientId(ws: WebSocket) {
    const clientId = uuidv4();
    const expiresAt = Date.now() + CLIENT_ID_TTL_MS;
    clientIdStore.set(clientId, expiresAt);
    try {
        const client = new Client({ clientId, expiresAt });
        await client.save();
    } catch (err) {
        logger.error('Failed to save clientId to MongoDB: ' + err);
    }
    ws.send(JSON.stringify({ clientId, expiresAt }));
}
