import { useEffect, useState } from 'react';
import API from '../api/api';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);

  const fetchBookmarks = async () => {
    const res = await API.get('/bookmarks');
    setBookmarks(res.data);
  };

  const removeBookmark = async (articleId) => {
    await API.delete(`/bookmarks/${articleId}`);
    fetchBookmarks();
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  return (
    <section className="feed-panel">
      <div className="hero-card">
        <div>
          <p className="eyebrow">Saved to desk</p>
          <h1>Your clippings</h1>
          <p>Stories you saved for later reading.</p>
        </div>

        <div className="brief-stamp">
          <span>{bookmarks.length}</span>
          <small>saved</small>
        </div>
      </div>

      <div className="article-bento">
        {bookmarks.map((item) => (
          <article key={item.bookmark_id} className="article-card">
            <div className="article-meta">
              <span>{item.category}</span>
              <span>{item.source}</span>
            </div>

            <h3>{item.title}</h3>
            <p>{item.summary || 'No summary available.'}</p>

            <div className="article-actions">
              <a href={item.url} target="_blank" rel="noreferrer">
                Open original
              </a>
              <button onClick={() => removeBookmark(item.article_id)}>
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}