import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getQuizLeaderboard, getGlobalStats, getQuizById } from '../services/api';
import './LeaderboardPage.css';

function LeaderboardPage() {
  const { quizId } = useParams(); // Se presente, mostra leaderboard di quel quiz
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [globalStats, setGlobalStats] = useState(null);

  useEffect(() => {
    loadLeaderboard();
  }, [quizId]);

  const loadLeaderboard = async () => {
    setLoading(true);
    setError('');

    try {
      if (quizId) {
        // Leaderboard di un quiz specifico
        const [leaderboardData, quizData] = await Promise.all([
          getQuizLeaderboard(quizId, 10),
          getQuizById(quizId)
        ]);
        
        setLeaderboard(leaderboardData.results);
        setQuiz(quizData.quiz);
      } else {
        // Statistiche globali
        const data = await getGlobalStats();
        setGlobalStats(data.stats);
        setLeaderboard(data.stats.topScores);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (position) => {
    switch(position) {
      case 0: return '🥇 Primo posto';
      case 1: return '🥈 Secondo posto';
      case 2: return '🥉 Terzo Posto';
      default: return `${position + 1} posto`;
    }
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 90) return '#4CAF50';
    if (percentage >= 70) return '#FF9800';
    return '#f44336';
  };

  if (loading) {
    return <div className="loading">Caricamento classifica...</div>;
  }

  if (error) {
    return (
      <div className="leaderboard-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/quizzes')} className="back-btn">
          ← Torna ai Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      {/* Header */}
      <div className="leaderboard-header">
        {quiz ? (
          <>
            <h1>🏆 Classifica: {quiz.title}</h1>
            <p className="quiz-info">
              <span className="badge">{quiz.category}</span>
              <span className="badge difficulty">{quiz.difficulty}</span>
            </p>
          </>
        ) : (
          <>
            <h1>🏆 Classifica Globale</h1>
            <p className="subtitle">I migliori punteggi di tutti i quiz</p>
          </>
        )}
      </div>

      {/* Statistiche Globali (solo se non è un quiz specifico) */}
      {!quiz && globalStats && (
        <div className="global-stats">
          <div className="stat-box">
            <div className="stat-icon">🎮</div>
            <div className="stat-value">{globalStats.totalGames}</div>
            <div className="stat-label">Partite Giocate</div>
          </div>
          <div className="stat-box">
            <div className="stat-icon">👥</div>
            <div className="stat-value">{globalStats.totalPlayers}</div>
            <div className="stat-label">Giocatori</div>
          </div>
        </div>
      )}

      {/* Podio (Top 3) */}
      {leaderboard.length >= 3 && (
        <div className="podium">
          {/* 2° Posto */}
          <div className="podium-position second">
            <div className="podium-medal">🥈</div>
            <div className="podium-player">
              {leaderboard[1].user?.username || 'Anonimo'}
            </div>
            <div className="podium-score">{leaderboard[1].score} pts</div>
            <div className="podium-percentage">{leaderboard[1].percentage}%</div>
            {!quiz && (
              <div className="podium-quiz">{leaderboard[1].quiz?.title}</div>
            )}
          </div>

          {/* 1° Posto */}
          <div className="podium-position first">
            <div className="podium-crown">👑</div>
            <div className="podium-medal">🥇</div>
            <div className="podium-player">
              {leaderboard[0].user?.username || 'Anonimo'}
            </div>
            <div className="podium-score">{leaderboard[0].score} pts</div>
            <div className="podium-percentage">{leaderboard[0].percentage}%</div>
            {!quiz && (
              <div className="podium-quiz">{leaderboard[0].quiz?.title}</div>
            )}
          </div>

          {/* 3° Posto */}
          <div className="podium-position third">
            <div className="podium-medal">🥉</div>
            <div className="podium-player">
              {leaderboard[2].user?.username || 'Anonimo'}
            </div>
            <div className="podium-score">{leaderboard[2].score} pts</div>
            <div className="podium-percentage">{leaderboard[2].percentage}%</div>
            {!quiz && (
              <div className="podium-quiz">{leaderboard[2].quiz?.title}</div>
            )}
          </div>
        </div>
      )}

      {/* Classifica Completa */}
      <div className="leaderboard-list">
        <h2>📊 Classifica Completa</h2>
        
        {leaderboard.length === 0 ? (
          <div className="no-results">
            <p>😔 Nessun risultato ancora!</p>
            {quiz && (
              <button 
                className="play-btn"
                onClick={() => navigate(`/play/${quizId}`)}
              >
                🎮 Sii il primo a giocare!
              </button>
            )}
          </div>
        ) : (
          <div className="results-table">
            {leaderboard.map((result, index) => (
              <div 
                key={result._id} 
                className={`result-row ${index < 3 ? 'top-three' : ''}`}
              >
                <div className="result-position">
                  <span className="position-number">{getMedalEmoji(index)}</span>
                </div>

                <div className="result-player">
                  <span className="player-name">
                    {result.user?.username || 'Anonimo'}
                  </span>
                  {!quiz && result.quiz && (
                    <span className="player-quiz">
                      {result.quiz.title}
                    </span>
                  )}
                </div>

                <div className="result-stats">
                  <div className="stat-item">
                    <span className="stat-label">Punteggio</span>
                    <span className="stat-value score">{result.score}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Corrette</span>
                    <span className="stat-value">
                      {result.correctAnswers}/{result.totalQuestions}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Percentuale</span>
                    <span 
                      className="stat-value percentage"
                      style={{ color: getPerformanceColor(result.percentage) }}
                    >
                      {result.percentage}%
                    </span>
                  </div>
                </div>

                {quiz && (
                  <div className="result-actions">
                    <button 
                      className="challenge-btn"
                      onClick={() => navigate(`/play/${quizId}`)}
                      title="Batti questo punteggio!"
                    >
                      ⚔️
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tasti azione */}
      <div className="leaderboard-actions">
        {quiz ? (
          <>
            <button 
              className="action-btn primary"
              onClick={() => navigate(`/play/${quizId}`)}
            >
              🎮 Gioca Ora
            </button>
            <button 
              className="action-btn secondary"
              onClick={() => navigate('/quizzes')}
            >
              📚 Altri Quiz
            </button>
          </>
        ) : (
          <button 
            className="action-btn primary"
            onClick={() => navigate('/quizzes')}
          >
            🎮 Gioca a un Quiz
          </button>
        )}
      </div>
    </div>
  );
}

export default LeaderboardPage;