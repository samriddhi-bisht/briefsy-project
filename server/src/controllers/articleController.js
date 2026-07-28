import pool from '../config/db.js';
import { fetchAndStoreNews } from '../services/newsService.js';
import cache from '../config/cache.js';

export const VALID_CATEGORIES = [
  'technology',
  'business',
  'sports',
  'science',
  'health',
  'entertainment',
];

// GET articles from DB/cache by category
export const getArticlesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ message: `category must be one of: ${VALID_CATEGORIES.join(', ')}` });
    }

    const cacheKey = `articles:${category}`;

    const cachedArticles = cache.get(cacheKey);

    if (cachedArticles) {
      console.log(`[CACHE HIT] ${cacheKey}`);
      return res.status(200).json(cachedArticles);
    }

    console.log(`[CACHE MISS] ${cacheKey} -> querying database`);

    const result = await pool.query(
      `SELECT id, title, summary, source, category, url, image_url, published_at
       FROM articles
       WHERE category = $1
       ORDER BY published_at DESC
       LIMIT 20`,
      [category]
    );

    cache.set(cacheKey, result.rows);
    console.log(`[CACHE SET] ${cacheKey} -> ${result.rows.length} articles stored`);

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

    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ message: `category must be one of: ${VALID_CATEGORIES.join(', ')}` });
    }

    const result = await fetchAndStoreNews(category);

    const cacheKey = `articles:${category}`;
    cache.del(cacheKey);
    console.log(`[CACHE INVALIDATED] ${cacheKey} after fresh fetch`);

    res.status(200).json({
      message: `Fetched and stored ${category} news successfully`,
      totalFetched: result.totalFetched,
      insertedCount: result.insertedCount,
    });
  } catch (error) {
    console.error('Fetch news error:', error.message);
    res.status(502).json({ message: 'Error fetching news from provider' });
  }
};

// GET personalized feed using user's domain_interest
export const getPersonalizedArticles = async (req, res) => {
  try {
    const userId = req.user.id;
    const userCacheKey = `personalized:user:${userId}`;

    const cachedFeed = cache.get(userCacheKey);

    if (cachedFeed) {
      console.log(`[CACHE HIT] ${userCacheKey}`);
      return res.status(200).json(cachedFeed);
    }

    console.log(`[CACHE MISS] ${userCacheKey} -> querying user + articles`);

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

    const response = {
      domain_interest: domainInterest,
      articles: articlesResult.rows,
    };

    cache.set(userCacheKey, response);
    console.log(`[CACHE SET] ${userCacheKey} -> ${articlesResult.rows.length} articles stored`);

    res.status(200).json(response);
  } catch (error) {
    console.error('Personalized feed error:', error.message);
    res.status(500).json({ message: 'Error fetching personalized feed' });
  }
};