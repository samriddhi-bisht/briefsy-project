import express from 'express';
import cors from 'cors';

import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import bookmarkRoutes from './routes/bookmarkRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { apiLimiter, authLimiter } from './middleware/rateLimiter.js';
import povRoutes from './routes/povRoutes.js';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  })
);
app.use(express.json());

app.use('/api', apiLimiter);

app.use('/api/health', healthRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/povs', povRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(err.status || 500).json({ message: 'Something went wrong' });
});

export default app;