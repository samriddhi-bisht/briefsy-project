import { useEffect, useState } from 'react';
import API from '../api/api';

const categories = [
  { key: 'technology', label: 'Tech Pulse', note: 'tools, startups, AI' },
  { key: 'business', label: 'Money Moves', note: 'markets & work' },
  { key: 'sports', label: 'Playbook', note: 'sports updates' },
  { key: 'science', label: 'Lab Notes', note: 'science bites' },
  { key: 'health', label: 'Mind & Body', note: 'health reads' },
  { key: 'entertainment', label: 'Pop Desk', note: 'culture & media' },
];

export default function Home() {
  const [category, setCategory] = useState('technology');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewTitle, setViewTitle] = useState('Tech Pulse');

  const activeCategory = categories.find((item) => item.key === category);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/articles/category/${category}`);
      setArticles(res.data);
      setViewTitle(activeCategory?.label || 'Today’s Brief');
    } catch (error) {
      console.error(error);
      alert('Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  const fetchPersonalized = async () => {
    try {
      setLoading(true);
      const res = await API.get('/articles/personalized');
      setArticles(res.data.articles);
      setViewTitle('My Brief');
    } catch (error) {
      alert(error.response?.data?.message || 'Login required for personalized feed');
    } finally {
      setLoading(false);
    }
  };

  const bookmarkArticle = async (articleId) => {
    try {
      await API.post(`/bookmarks/${articleId}`);
      alert('Saved to your desk');
    } catch (error) {
      alert(error.response?.data?.message || 'Bookmark failed');
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [category]);

  return (
    <section className="desk-layout">
      <aside className="sidebar-card">
        <p className="eyebrow">Brief channels</p>
        <h2>Pick your desk</h2>

        <div className="category-stack">
          {categories.map((item) => (
            <button
              key={item.key}
              className={category === item.key ? 'category-tile active' : 'category-tile'}
              onClick={() => setCategory(item.key)}
            >
              <span>{item.label}</span>
              <small>{item.note}</small>
            </button>
          ))}

          <button className="category-tile personalized-btn" onClick={fetchPersonalized}>
            <span>My Brief</span>
            <small>based on your interest</small>
          </button>
        </div>
      </aside>

      <section className="feed-panel">
        <div className="hero-card">
          <div>
            <p className="eyebrow">Today’s brief</p>
            <h1>{viewTitle}</h1>
            <p>
              Bite-sized updates curated for quick reading, deeper thinking,
              and smarter conversations.
            </p>
          </div>

          <div className="brief-stamp">
            <span>{articles.length}</span>
            <small>stories</small>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">Preparing your brief...</div>
        ) : articles.length === 0 ? (
          <div className="empty-state">No stories found. Fetch this category from backend first.</div>
        ) : (
          <div className="article-bento">
            {articles.map((article, index) => (
              <article
                key={article.id}
                className={index % 5 === 0 ? 'article-card feature-card' : 'article-card'}
              >
                <div className="article-meta">
                  <span>{article.category}</span>
                  <span>{article.source}</span>
                </div>

                <h3>{article.title}</h3>
                <p>{article.summary || 'No summary available for this story yet.'}</p>

                <div className="article-actions">
                  <a href={article.url} target="_blank" rel="noreferrer">
                    Open original
                  </a>
                  <button onClick={() => bookmarkArticle(article.id)}>
                    Save
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}