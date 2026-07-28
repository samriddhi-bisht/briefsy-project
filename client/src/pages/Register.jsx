import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/api';
import Toast from '../components/Toast';

const domains = ['technology', 'business', 'sports', 'science', 'health', 'entertainment'];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    domain_interest: 'technology',
  });
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      const res = await API.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
      window.location.reload();
    } catch (error) {
      setToast({
        message: error.response?.data?.message || 'Registration failed, please try again',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-wrap">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Join Briefsy</p>
        <h1>Build your knowledge desk</h1>

        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <select
          value={form.domain_interest}
          onChange={(e) => setForm({ ...form, domain_interest: e.target.value })}
        >
          {domains.map((domain) => (
            <option key={domain} value={domain}>
              {domain}
            </option>
          ))}
        </select>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating desk...' : 'Create desk'}
        </button>

        <p>
          Already joined? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
}
