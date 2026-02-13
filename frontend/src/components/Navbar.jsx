import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <img src={logo} alt="KnowIt Logo" className="logo-img" />
        <span className="logo-text">KnowIt</span>
      </div>
      <ul className="nav-menu">
        <li onClick={() => navigate('/quizzes')} style={{ cursor: 'pointer' }}>Lista Quiz</li>
        <li onClick={() => navigate('/leaderboard')} style={{ cursor: 'pointer' }}>Classifica Globale</li>
        
        {user ? (
          <>
            <li className="username">Ciao, {user.username}!</li>
            <li className="logout-btn" onClick={handleLogout}>Logout</li>
          </>
        ) : (
          <>
            <li className="accedi" onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>Accedi</li>
            <li onClick={() => navigate('/register')} style={{ cursor: 'pointer' }}>Registrati</li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;