import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getQuizLeaderboard, getGlobalStats, getQuizById } from '../services/api';
import '../styles/LeaderboardPage.css';
import LeaderboardRow from '../components/LeaderboardRow';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <div className="podium-position second">
            <div className="podium-medal">🥈</div>
            <div className="podium-player">{leaderboard[1].user?.username || 'Anonimo'}</div>
            <div className="podium-score">{leaderboard[1].score} pts</div>
          </div>

          <div className="podium-position first">
            <div className="podium-crown">👑</div>
            <div className="podium-medal">🥇</div>
            <div className="podium-player">{leaderboard[0].user?.username || 'Anonimo'}</div>
            <div className="podium-score">{leaderboard[0].score} pts</div>
          </div>

          <div className="podium-position third">
            <div className="podium-medal">🥉</div>
            <div className="podium-player">{leaderboard[2].user?.username || 'Anonimo'}</div>
            <div className="podium-score">{leaderboard[2].score} pts</div>
          </div>
        </div>
      )}

      {/* Tabella Risultati: Utilizzo del componente FIGLIO LeaderboardRow */}
      <div className="leaderboard-list">
        <h2>📊 Classifica Completa</h2>
        
        {leaderboard.length === 0 ? (
          <div className="no-results">
            <p>😔 Nessun risultato ancora!</p>
          </div>
        ) : (
          <div className="results-table">
            {leaderboard.map((result, index) => (
              <LeaderboardRow 
                key={result._id} 
                result={result} 
                index={index} 
                isQuizSpecific={!!quizId} // Passiamo un booleano per adattare la riga
              />
            ))}
          </div>
        )}
      </div>

      <div className="leaderboard-actions">
        <button 
          className="action-btn primary"
          onClick={() => navigate('/quizzes')}
        >
          🎮 Gioca a un Quiz
        </button>
      </div>
    </div>
  );
}

export default LeaderboardPage;