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

app.use(cors());
app.use(express.json());

app.use('/api', apiLimiter);

app.use('/api/health', healthRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/povs', povRoutes);

export default app;