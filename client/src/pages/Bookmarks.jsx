import { useEffect, useState } from 'react';
import API from '../api/api';
import Toast from '../components/Toast';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const res = await API.get('/bookmarks');
      setBookmarks(res.data);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to load bookmarks', 'error');
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (articleId) => {
    try {
      await API.delete(`/bookmarks/${articleId}`);
      setBookmarks((prev) => prev.filter((item) => item.article_id !== articleId));
      showToast('Bookmark removed');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to remove bookmark', 'error');
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  return (
    <section className="feed-panel">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

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

      {loading ? (
        <div className="empty-state">Loading your saved stories...</div>
      ) : bookmarks.length === 0 ? (
        <div className="empty-state">Nothing saved yet. Bookmark a story from the desk.</div>
      ) : (
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
      )}
    </section>
  );
}
