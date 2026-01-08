import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validazione password
    if (formData.password !== formData.confirmPassword) {
      setError('Le password non coincidono');
      return;
    }

    if (formData.password.length < 6) {
      setError('La password deve essere di almeno 6 caratteri');
      return;
    }

    setLoading(true);

    // Rimuovi confirmPassword prima di inviare
    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);

    if (result.success) {
      navigate('/'); // Vai alla homepage
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>✨ Registrati</h1>
        <p className="auth-subtitle">Crea il tuo account per iniziare</p>

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="mario_rossi"
              required
              minLength={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="mario@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={6}
            />
            <small>Minimo 6 caratteri</small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Conferma Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
          >
            {loading ? '⏳ Registrazione...' : '🎉 Registrati'}
          </button>
        </form>

        <div className="auth-footer">
          Hai già un account?{' '}
          <Link to="/login" className="auth-link">
            Accedi qui
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;