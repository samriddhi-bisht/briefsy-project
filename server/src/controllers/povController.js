import pool from '../config/db.js';

export const createPov = async (req, res) => {
  try {
    const userId = req.user.id;
    const { articleId } = req.params;
    const { content, pov_type } = req.body;

    if (!content || content.trim().length < 5) {
      return res.status(400).json({ message: 'POV must be at least 5 characters long' });
    }

    const articleExists = await pool.query('SELECT id FROM articles WHERE id = $1', [articleId]);

    if (articleExists.rows.length === 0) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const result = await pool.query(
      `INSERT INTO povs (user_id, article_id, content, pov_type)
       VALUES ($1, $2, $3, $4)
       RETURNING id, user_id, article_id, content, pov_type, created_at`,
      [userId, articleId, content.trim(), pov_type || 'personal']
    );

    res.status(201).json({
      message: 'POV added successfully',
      pov: result.rows[0],
    });
  } catch (error) {
    console.error('Create POV error:', error.message);
    res.status(500).json({ message: 'Error creating POV' });
  }
};

export const getPovsByArticle = async (req, res) => {
  try {
    const { articleId } = req.params;

    const result = await pool.query(
      `SELECT 
        p.id,
        p.article_id,
        p.content,
        p.pov_type,
        p.created_at,
        u.name AS author_name,
        COALESCE(SUM(CASE WHEN v.vote_type = 'up' THEN 1 WHEN v.vote_type = 'down' THEN -1 ELSE 0 END), 0) AS score
       FROM povs p
       JOIN users u ON p.user_id = u.id
       LEFT JOIN pov_votes v ON p.id = v.pov_id
       WHERE p.article_id = $1
       GROUP BY p.id, u.name
       ORDER BY score DESC, p.created_at DESC`,
      [articleId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get POVs error:', error.message);
    res.status(500).json({ message: 'Error fetching POVs' });
  }
};

export const votePov = async (req, res) => {
  try {
    const userId = req.user.id;
    const { povId } = req.params;
    const { vote_type } = req.body;

    if (!['up', 'down'].includes(vote_type)) {
      return res.status(400).json({ message: 'vote_type must be up or down' });
    }

    const povExists = await pool.query('SELECT id FROM povs WHERE id = $1', [povId]);

    if (povExists.rows.length === 0) {
      return res.status(404).json({ message: 'POV not found' });
    }

    const result = await pool.query(
      `INSERT INTO pov_votes (user_id, pov_id, vote_type)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, pov_id)
       DO UPDATE SET vote_type = EXCLUDED.vote_type, created_at = CURRENT_TIMESTAMP
       RETURNING id, user_id, pov_id, vote_type`,
      [userId, povId, vote_type]
    );

    res.status(200).json({
      message: 'Vote recorded',
      vote: result.rows[0],
    });
  } catch (error) {
    console.error('Vote POV error:', error.message);
    res.status(500).json({ message: 'Error voting POV' });
  }
};

export const deletePov = async (req, res) => {
  try {
    const userId = req.user.id;
    const { povId } = req.params;

    const result = await pool.query(
      `DELETE FROM povs
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [povId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'POV not found or not owned by user' });
    }

    res.status(200).json({ message: 'POV deleted successfully' });
  } catch (error) {
    console.error('Delete POV error:', error.message);
    res.status(500).json({ message: 'Error deleting POV' });
  }
};