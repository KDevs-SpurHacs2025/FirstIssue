# FirstIssue - Setup Guide

## Prerequisites

- Node.js
- MongoDB
- Git

## Backend Setup

1. Navigate to backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure:
   ```
   PORT=3001
   MONGO_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Start backend: `npm run dev`

## Frontend Setup

1. Navigate to frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure:
   ```
   VITE_API_BASE_URL=http://localhost:3001
   ```
4. Start frontend: `npm run dev`

## Common Issues

- **Port already in use**: Change PORT in backend/.env
- **CORS errors**: Make sure backend and frontend URLs match in .env files
