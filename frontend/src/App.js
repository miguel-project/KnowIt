import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/loginPage';
import RegisterPage from './pages/RegisterPage';
import './App.css';

// Componente Navbar
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
        🎮 KnowIt
      </div>
      <ul className="nav-menu">
        <li onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</li>
        <li style={{ cursor: 'pointer' }}>Classifica Globale</li>
        <li style={{ cursor: 'pointer' }}>Chi Siamo</li>
        <li style={{ cursor: 'pointer' }}>FAQ</li>
        <li style={{ cursor: 'pointer' }}>Contatti</li>
        
        {user ? (
          <>
            <li className="username">Ciao, {user.username}!</li>
            <li className="logout-btn" onClick={handleLogout}>Logout</li>
          </>
        ) : (
          <>
            <li className="accedi" onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>
              Accedi
            </li>
            <li onClick={() => navigate('/register')} style={{ cursor: 'pointer' }}>
              Registrati
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

// Componente principale
function AppContent() {
  return (
    <div className="App">
      <Navbar />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>© 2025 KnowIt - Progetto Fondamenti Web</p>
        <p className="footer-info">Realizzato da Antonio Marinotti, Giovanni Grimaldi, Michele Santopietro</p>
      </footer>
    </div>
  );
}

// Wrap con Router e AuthProvider
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;