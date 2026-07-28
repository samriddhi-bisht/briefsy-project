import express from 'express';
import {
  getArticlesByCategory,
  fetchNews,
  getPersonalizedArticles,
} from '../controllers/articleController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/fetch/:category', protect, fetchNews);
router.get('/category/:category', getArticlesByCategory);
router.get('/personalized', protect, getPersonalizedArticles);

export default router;