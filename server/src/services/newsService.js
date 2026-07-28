import axios from 'axios';
import pool from '../config/db.js';

export const fetchAndStoreNews = async (category) => {
  const API_KEY = process.env.NEWS_API_KEY;

  if (!API_KEY) {
    throw new Error('NEWS_API_KEY is missing in .env');
  }

  const response = await axios.get('https://newsapi.org/v2/top-headlines', {
    params: {
      category,
      country: 'us',
      apiKey: API_KEY,
    },
  });

  if (response.data.status !== 'ok') {
    throw new Error(response.data.message || `NewsAPI returned an error for category: ${category}`);
  }

  const articles = response.data.articles;

  if (!articles || articles.length === 0) {
    throw new Error(`No articles returned for category: ${category}`);
  }

  let insertedCount = 0;

  for (const article of articles) {
    if (!article.title || !article.url) continue;

    const result = await pool.query(
      `INSERT INTO articles (title, summary, content, source, category, url, image_url, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (url) DO NOTHING
       RETURNING id`,
      [
        article.title,
        article.description || null,
        article.content || null,
        article.source?.name || 'Unknown',
        category,
        article.url,
        article.urlToImage || null,
        article.publishedAt || null,
      ]
    );

    if (result.rows.length > 0) {
      insertedCount += 1;
    }
  }

  return {
    totalFetched: articles.length,
    insertedCount,
  };
};