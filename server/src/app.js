import express from 'express';
import cors from 'cors';

import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import bookmarkRoutes from './routes/bookmarkRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

export default app;