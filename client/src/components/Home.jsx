import { useEffect, useState } from 'react';
import API from '../api/api';

const categories = ['technology', 'business', 'sports', 'science', 'health', 'entertainment'];

export default function Home() {
  const [category, setCategory] = useState('technology');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/articles/category/${category}`);
      setArticles(res.data);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  const bookmarkArticle = async (articleId) => {
    try {
      await API.post(`/bookmarks/${articleId}`);
      alert('Bookmarked');
    } catch (error) {
      alert(error.response?.data?.message || 'Bookmark failed');
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [category]);

  return (
    <div style={{ padding: 24 }}>
      <h1>Briefsy — Smart Short News</h1>
      <p>Choose a category and read crisp updates.</p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        {categories.map((item) => (
          <button key={item} onClick={() => setCategory(item)}>
            {item}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {articles.map((article) => (
            <div key={article.id} style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8 }}>
              <h3>{article.title}</h3>
              <p>{article.summary}</p>
              <p><strong>Source:</strong> {article.source}</p>
              <a href={article.url} target="_blank" rel="noreferrer">Read full article</a>
              <br />
              <button onClick={() => bookmarkArticle(article.id)} style={{ marginTop: 10 }}>
                Bookmark
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}