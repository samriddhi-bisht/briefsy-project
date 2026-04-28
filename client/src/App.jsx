import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Bookmarks from './pages/Bookmarks';
import Navbar from './components/Navbar';

function App() {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={token ? <Navigate to="/" /> : <Register />} />
        <Route path="/bookmarks" element={token ? <Bookmarks /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;