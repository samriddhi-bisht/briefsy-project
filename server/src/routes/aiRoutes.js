import express from 'express';
import { explainArticle } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/explain', protect, explainArticle);

export default router;