import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Bookmarks from './pages/Bookmarks';
import Navbar from './components/Navbar';
import './index.css';

function App() {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={token ? <Navigate to="/" /> : <Register />} />
            <Route path="/bookmarks" element={token ? <Bookmarks /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;