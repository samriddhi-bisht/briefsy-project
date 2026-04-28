import { Link, NavLink, useNavigate } from 'react-router-dom';

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
    <header className="topbar">
      <Link to="/" className="brand">
        <span className="brand-mark">b</span>
        <span>
          <strong>Briefsy</strong>
          <small>your daily knowledge desk</small>
        </span>
      </Link>

      <nav className="nav-links">
        <NavLink to="/">Desk</NavLink>
        {token && <NavLink to="/bookmarks">Saved</NavLink>}

        {!token ? (
          <>
            <NavLink to="/login">Login</NavLink>
            <Link to="/register" className="nav-cta">Join Briefsy</Link>
          </>
        ) : (
          <button className="logout-btn" onClick={logout}>Logout</button>
        )}
      </nav>
    </header>
  );
}