/**
 * PlacementPal - Main Express Server
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import interviewRoutes from './routes/interview.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/interview', interviewRoutes);

// Root healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'PlacementPal AI Server',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 PlacementPal Backend Server running on port ${PORT}`);
  console.log(`🤖 Provider: ${process.env.AI_PROVIDER || 'ollama'}`);
  console.log(`🧠 Model: ${process.env.GEMMA_MODEL_NAME || 'gemma2:9b'}`);
  console.log(`=======================================================`);
});
