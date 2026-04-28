import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav style={{ padding: '16px 24px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between' }}>
      <Link to="/" style={{ fontWeight: 'bold', fontSize: 22, textDecoration: 'none', color: '#111' }}>
        Briefsy
      </Link>

      <div style={{ display: 'flex', gap: 16 }}>
        <Link to="/">Home</Link>
        {token && <Link to="/bookmarks">Bookmarks</Link>}
        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
      </div>
    </nav>
  );
}