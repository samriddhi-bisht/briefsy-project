import pool from '../config/db.js';

// Add bookmark
export const addBookmark = async (req, res) => {
  try {
    const userId = req.user.id;
    const { articleId } = req.params;

    const articleExists = await pool.query(
      'SELECT id FROM articles WHERE id = $1',
      [articleId]
    );

    if (articleExists.rows.length === 0) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const result = await pool.query(
      `INSERT INTO bookmarks (user_id, article_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, article_id) DO NOTHING
       RETURNING id, user_id, article_id, created_at`,
      [userId, articleId]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({ message: 'Article already bookmarked' });
    }

    res.status(201).json({
      message: 'Article bookmarked successfully',
      bookmark: result.rows[0],
    });
  } catch (error) {
    console.error('Add bookmark error:', error.message);
    res.status(500).json({ message: 'Error adding bookmark' });
  }
};

// Get logged-in user's bookmarks
export const getBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT 
        b.id AS bookmark_id,
        b.created_at AS bookmarked_at,
        a.id AS article_id,
        a.title,
        a.summary,
        a.source,
        a.category,
        a.url,
        a.image_url,
        a.published_at
       FROM bookmarks b
       JOIN articles a ON b.article_id = a.id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get bookmarks error:', error.message);
    res.status(500).json({ message: 'Error fetching bookmarks' });
  }
};

// Remove bookmark
export const removeBookmark = async (req, res) => {
  try {
    const userId = req.user.id;
    const { articleId } = req.params;

    const result = await pool.query(
      `DELETE FROM bookmarks
       WHERE user_id = $1 AND article_id = $2
       RETURNING id`,
      [userId, articleId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    res.status(200).json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    console.error('Remove bookmark error:', error.message);
    res.status(500).json({ message: 'Error removing bookmark' });
  }
};