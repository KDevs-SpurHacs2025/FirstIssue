import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import routes from './routes/routes.js';
import { createClientIdWebSocketServer } from './ws/clientIdSocket.js';
import logger from './utils/logger.js';
import cors from 'cors'; // Import the cors middleware

dotenv.config(); // Load environment variables from .env file

const app = express();

// CORS configuration: Allow all origins for development
app.use(
  cors({
    origin: "*", // Allow all origins for development
    methods: ["GET", "POST"], // Allow GET and POST requests
    credentials: false, // Disable credentials when using wildcard origin
  })
);

app.use(express.json()); // Enable JSON body parsing for incoming requests
let server: import("http").Server; // Declare server variable

const PORT = process.env.PORT || 3001; // Set server port, default to 3001

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGO_URI as string,
    {
      // useNewUrlParser: true, // Deprecated and has no effect in Mongoose 4.0.0+
      // useUnifiedTopology: true // Deprecated and has no effect in Mongoose 4.0.0+
    } as any // Type assertion for Mongoose options if needed by your TypeScript setup
  )
  .then(() => {
    logger.info("MongoDB connected");
    // Start server only after successful DB connection
    server = http.createServer(app); // Create HTTP server from Express app
    // createClientIdWebSocketServer(server); // Initialize WebSocket server with the HTTP server
    server.listen(PORT, () => {
      logger.info(`Server and WebSocket running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("MongoDB connection error:", err);
    process.exit(1); // Exit process if MongoDB connection fails
  });

// Graceful shutdown: Handle SIGINT (Ctrl+C) and SIGTERM (kill command) signals
function gracefulShutdown() {
  logger.info("Shutting down gracefully...");
  if (server) {
    server.close(() => {
      // Close HTTP server
      logger.info("HTTP server closed.");
      mongoose.connection.close().then(() => {
        // Close MongoDB connection
        logger.info("MongoDB connection closed.");
        process.exit(0); // Exit process cleanly
      });
    });
  } else {
    process.exit(0); // If server wasn't started, just exit
  }
}
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

// Mount API routes under '/api' path
app.use("/api", routes);
