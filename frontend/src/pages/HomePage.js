import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllQuizzes, getGlobalStats } from '../services/api';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalGames: 0,
    totalPlayers: 0
  });
  const [featuredQuizzes, setFeaturedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      // Carica quiz e statistiche in parallelo
      const [quizzesData, globalData] = await Promise.all([
        getAllQuizzes(),
        getGlobalStats().catch(() => ({ stats: { totalGames: 0, totalPlayers: 0 } }))
      ]);

      setStats({
        totalQuizzes: quizzesData.quizzes.length,
        totalGames: globalData.stats.totalGames,
        totalPlayers: globalData.stats.totalPlayers
      });

      // Prendi 3 quiz casuali come "in evidenza"
      const shuffled = [...quizzesData.quizzes].sort(() => 0.5 - Math.random());
      setFeaturedQuizzes(shuffled.slice(0, 3));

    } catch (error) {
      console.error('Errore nel caricamento dati homepage:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'facile': return '#4CAF50';
      case 'medio': return '#FF9800';
      case 'difficile': return '#F44336';
      default: return '#999';
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        {user && (
          <div className="welcome-badge">
            👋 Ciao, <strong>{user.username}</strong>!
          </div>
        )}

        <h1 className="hero-title">Benvenuto in KnowIt!</h1>
        <p className="hero-subtitle">
          Crea quiz personalizzati, sfida i tuoi amici e scala la classifica!
        </p>

        <div className="hero-actions">
  
          {user ? (
            <button 
              className="hero-btn secondary"
              onClick={() => navigate('/create-quiz')}
            >
              ➕ Crea Quiz
            </button>
          ) : (
            <div className='instruction'>
              Esegui l'accesso o registrati per creare quiz 
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <h2>✨ Perché KnowIt?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Crea Quiz Personalizzati</h3>
            <p>Scegli categoria, difficoltà e aggiungi le tue domande</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Gioca e Divertiti</h3>
            <p>Rispondi alle domande e ottieni il punteggio più alto</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Sfida la Classifica</h3>
            <p>Compete con altri giocatori e raggiungi la vetta</p>
          </div>
        </div>
      </section>

      {/* Box pronto ad iniziare*/}
      <section className="cta-section">
        <h2>🚀 Pronto a Iniziare?</h2>
        <p>Unisciti alla community e metti alla prova le tue conoscenze!</p>
        <button 
          className="cta-btn"
          onClick={() => navigate('/quizzes')}
        >
          Inizia a Giocare
        </button>
      </section> 

      {/* Statistiche */}
      <section className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-value">{stats.totalQuizzes}</div>
          <div className="stat-label">Quiz Disponibili</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎮</div>
          <div className="stat-value">{stats.totalGames}</div>
          <div className="stat-label">Partite Giocate</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{stats.totalPlayers}</div>
          <div className="stat-label">Giocatori</div>
        </div>
      </section>

      {/* Quiz in Evidenza */}
      {!loading && featuredQuizzes.length > 0 && (
        <section className="featured-section">
          <h2>🔥 Quiz in Evidenza</h2>
          <div className="featured-grid">
            {featuredQuizzes.map(quiz => (
              <div key={quiz._id} className="featured-quiz-card">
                <div className="featured-quiz-header">
                  <span className="featured-badge">{quiz.category}</span>
                  <span 
                    className="featured-difficulty"
                    style={{ backgroundColor: getDifficultyColor(quiz.difficulty) }}
                  >
                    {quiz.difficulty}
                  </span>
                </div>

                <h3 className="featured-title">{quiz.title}</h3>
                <p className="featured-description">
                  {quiz.description.length > 80 
                    ? quiz.description.substring(0, 80) + '...' 
                    : quiz.description
                  }
                </p>

                <div className="featured-meta">
                  <span>❓ {quiz.questions?.length || 0} domande</span>
                  <span>👤 {quiz.createdBy?.username}</span>
                </div>

                <button 
                  className="featured-play-btn"
                  onClick={() => navigate(`/play/${quiz._id}`)}
                >
                  🎮 Gioca
                </button>
              </div>
            ))}
          </div>

          <button 
            className="view-all-btn"
            onClick={() => navigate('/quizzes')}
          >
            Vedi Tutti i Quiz →
          </button>
        </section>
      )}
    </div>
  );
}

export default HomePage;