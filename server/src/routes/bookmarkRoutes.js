import express from 'express';
import {
  addBookmark,
  getBookmarks,
  removeBookmark,
} from '../controllers/bookmarkController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:articleId', protect, addBookmark);
router.get('/', protect, getBookmarks);
router.delete('/:articleId', protect, removeBookmark);

export default router;