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

export const getPersonalizedArticles = async (req, res) => {
  try {
    const userId = req.user.id;

    const userResult = await pool.query(
      'SELECT domain_interest FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const domainInterest = userResult.rows[0].domain_interest || 'technology';

    const articlesResult = await pool.query(
      `SELECT id, title, summary, source, category, url, image_url, published_at
       FROM articles
       WHERE category = $1
       ORDER BY published_at DESC
       LIMIT 20`,
      [domainInterest]
    );

    res.status(200).json({
      domain_interest: domainInterest,
      articles: articlesResult.rows,
    });
  } catch (error) {
    console.error('Personalized feed error:', error.message);
    res.status(500).json({ message: 'Error fetching personalized feed' });
  }
};