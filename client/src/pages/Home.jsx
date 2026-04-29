import { useEffect, useState } from 'react';
import API from '../api/api';
import Toast from '../components/Toast';

const categories = [
  { key: 'technology', label: 'Tech Pulse', note: 'AI, tools, tech shifts' },
  { key: 'business', label: 'Money Moves', note: 'markets and companies' },
  { key: 'sports', label: 'Playbook', note: 'matches and moments' },
  { key: 'science', label: 'Lab Notes', note: 'research and discoveries' },
  { key: 'health', label: 'Mind & Body', note: 'health and wellbeing' },
  { key: 'entertainment', label: 'Pop Desk', note: 'culture and media' },
];

const povTypes = ['all', 'supporting', 'critical', 'neutral', 'personal'];

export default function Home() {
  const [category, setCategory] = useState('technology');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [povs, setPovs] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [newPov, setNewPov] = useState('');
  const [povType, setPovType] = useState('personal');
  const [povFilter, setPovFilter] = useState('all');
  const [toast, setToast] = useState(null);

  const activeCategory = categories.find((item) => item.key === category);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/articles/category/${category}`);
      setArticles(res.data);
      setSelectedArticle(null);
      setPovs([]);
    } catch (error) {
      showToast('Failed to fetch articles', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openPerspectives = async (article) => {
    try {
      setSelectedArticle(article);
      setPovFilter('all');

      const res = await API.get(`/povs/${article.id}`);
      setPovs(res.data);
    } catch (error) {
      showToast('Could not load perspectives', 'error');
    }
  };

  const addPov = async () => {
    try {
      if (!selectedArticle || !newPov.trim()) {
        showToast('Please write your perspective first', 'error');
        return;
      }

      await API.post(`/povs/${selectedArticle.id}`, {
        content: newPov,
        pov_type: povType,
      });

      setNewPov('');
      setPovType('personal');

      const res = await API.get(`/povs/${selectedArticle.id}`);
      setPovs(res.data);

      showToast('Perspective posted');
    } catch (error) {
      showToast(error.response?.data?.message || 'Could not post perspective', 'error');
    }
  };

  const votePov = async (povId, type) => {
    try {
      await API.post(`/povs/${povId}/vote`, { vote_type: type });
      openPerspectives(selectedArticle);
      showToast('Vote recorded');
    } catch (error) {
      showToast(error.response?.data?.message || 'Could not vote', 'error');
    }
  };

  const bookmarkArticle = async (articleId) => {
    try {
      await API.post(`/bookmarks/${articleId}`);
      showToast('Saved to your desk');
    } catch (error) {
      showToast(error.response?.data?.message || 'Bookmark failed', 'error');
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [category]);

  const filteredPovs =
    povFilter === 'all' ? povs : povs.filter((pov) => pov.pov_type === povFilter);

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <section className="perspective-layout">
        <aside className="side-panel">
          <p className="eyebrow">News rooms</p>
          <h2>Choose a lens</h2>

          <div className="category-list">
            {categories.map((item) => (
              <button
                key={item.key}
                className={category === item.key ? 'lens-btn active' : 'lens-btn'}
                onClick={() => setCategory(item.key)}
              >
                <span>{item.label}</span>
                <small>{item.note}</small>
              </button>
            ))}
          </div>
        </aside>

        <main className="story-feed">
          <section className="feed-hero">
            <p className="eyebrow">Briefsy perspective engine</p>
            <h1>{activeCategory?.label}</h1>
            <p>
              Pick a story, read the context, then compare how people interpret the same headline.
            </p>
          </section>

          {loading ? (
            <div className="empty-state">Loading stories...</div>
          ) : (
            <div className="story-list">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className={
                    selectedArticle?.id === article.id ? 'story-card selected' : 'story-card'
                  }
                >
                  <div className="story-meta">
                    <span>{article.category}</span>
                    <span>{article.source}</span>
                  </div>

                  <h3>{article.title}</h3>
                  <p>{article.summary || 'No summary available for this story.'}</p>

                  <div className="story-actions">
                    <a href={article.url} target="_blank" rel="noreferrer">
                      Original
                    </a>
                    <button onClick={() => bookmarkArticle(article.id)}>Save</button>
                    <button onClick={() => openPerspectives(article)}>Discuss</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>

        <aside className="perspective-panel">
          {!selectedArticle ? (
            <div className="empty-perspective">
              <p className="eyebrow">Perspective panel</p>
              <h2>Select a story</h2>
              <p>Click Discuss on any story to see public POVs and add your own.</p>
            </div>
          ) : (
            <>
              <div className="panel-story">
                <p className="eyebrow">Selected story</p>
                <h2>{selectedArticle.title}</h2>
                <span>{povs.length} perspectives</span>
              </div>

              <div className="filter-pills">
                {povTypes.map((type) => (
                  <button
                    key={type}
                    className={povFilter === type ? 'active' : ''}
                    onClick={() => setPovFilter(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="compose-box">
                <select value={povType} onChange={(e) => setPovType(e.target.value)}>
                  <option value="personal">Personal take</option>
                  <option value="supporting">Supporting view</option>
                  <option value="critical">Critical view</option>
                  <option value="neutral">Neutral view</option>
                </select>

                <textarea
                  placeholder="What side of the story do you see?"
                  value={newPov}
                  onChange={(e) => setNewPov(e.target.value)}
                />

                <button onClick={addPov}>Post Perspective</button>
              </div>

              <div className="pov-stream">
                {filteredPovs.length === 0 ? (
                  <p className="quiet-text">No perspectives in this filter yet.</p>
                ) : (
                  filteredPovs.map((pov) => (
                    <div key={pov.id} className="pov-card">
                      <div className="pov-card-top">
                        <span className={`pov-badge ${pov.pov_type}`}>
                          {pov.pov_type}
                        </span>
                        <small>by {pov.author_name}</small>
                      </div>

                      <p>{pov.content}</p>

                      <div className="vote-row">
                        <strong>Score {pov.score}</strong>
                        <button onClick={() => votePov(pov.id, 'up')}>Upvote</button>
                        <button onClick={() => votePov(pov.id, 'down')}>Downvote</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </aside>
      </section>
    </>
  );
}