import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/loginPage';
import RegisterPage from './pages/RegisterPage';
import './App.css';
import QuizDetailPage from './pages/QuizDetailPage';
import QuizListPage from './pages/QuizListPage';
import CreateQuizPage from './pages/CreateQuizPage';
import PlayQuizPage from './pages/PlayQuizPage';
import LeaderboardPage from './pages/LeaderboardPage';
import logo from './assets/logo.png';

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
        <img src={logo} alt="KnowIt Logo" className="logo-img" />
        <span className="logo-text">KnowIt</span>
      </div>
      <ul className="nav-menu">
        <li onClick={() => navigate('/quizzes')} style={ {cursor: 'pointer'}}>Lista Quiz</li>
        <li onClick={() => navigate('/leaderboard')} style={{ cursor: 'pointer' }}>Classifica Globale</li>
        
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
            <Route path="/quizzes" element={<QuizListPage />} />
            <Route path="/create-quiz" element={<CreateQuizPage />} />
            <Route path="/quiz/:id" element={<QuizDetailPage />} /> 
            <Route path="/play/:id" element={<PlayQuizPage />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/leaderboard" element={<LeaderboardPage key="global" />} />
            <Route path="/leaderboard/:quizId" element={<LeaderboardPage key="quiz" />} />
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