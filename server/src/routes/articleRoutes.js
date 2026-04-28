import express from 'express';
import { getArticlesByCategory, fetchNews } from '../controllers/articleController.js';

const router = express.Router();

// fetch from API and store in DB
router.get('/fetch/:category', fetchNews);

// get from DB
router.get('/category/:category', getArticlesByCategory);

export default router;