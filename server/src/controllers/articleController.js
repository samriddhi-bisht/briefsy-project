import pool from '../config/db.js';
import { fetchAndStoreNews } from '../services/newsService.js';

// GET articles from DB by category
export const getArticlesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const result = await pool.query(
      `SELECT id, title, summary, source, category, url, image_url, published_at
       FROM articles
       WHERE category = $1
       ORDER BY published_at DESC
       LIMIT 20`,
      [category]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Fetch articles error:', error.message);
    res.status(500).json({ message: 'Error fetching articles' });
  }
};

// FETCH from external API + STORE in DB
export const fetchNews = async (req, res) => {
  try {
    const { category } = req.params;

    const result = await fetchAndStoreNews(category);

    res.status(200).json({
      message: `Fetched and stored ${category} news successfully`,
      totalFetched: result.totalFetched,
      insertedCount: result.insertedCount,
    });
  } catch (error) {
    console.error('Fetch news error:', error.message);
    res.status(500).json({
      message: 'Error fetching news',
      error: error.message,
    });
  }
};