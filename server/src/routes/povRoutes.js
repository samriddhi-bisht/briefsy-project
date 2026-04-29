import express from 'express';
import {
  createPov,
  getPovsByArticle,
  votePov,
  deletePov,
} from '../controllers/povController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:articleId', getPovsByArticle);
router.post('/:articleId', protect, createPov);
router.post('/:povId/vote', protect, votePov);
router.delete('/:povId', protect, deletePov);

export default router;