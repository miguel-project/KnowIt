import React from 'react';

/**
 * Componente Figlio per la singola riga della classifica.
 * Riceve 'result' (i dati), 'index' (la posizione) e 
 * 'isQuizSpecific' (per sapere se mostrare il titolo del quiz).
 */
function LeaderboardRow({ result, index, isQuizSpecific }) {
  
  // Logica per le medaglie spostata qui dal Genitore
  const getMedalEmoji = (position) => {
    switch(position) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `${position + 1}°`;
    }
  };

  // Logica per i colori della performance spostata qui
  const getPerformanceColor = (percentage) => {
    if (percentage >= 90) return '#4CAF50'; // Verde
    if (percentage >= 70) return '#FF9800'; // Arancio
    return '#f44336'; // Rosso
  };

  return (
    <div className={`result-row ${index < 3 ? 'top-three' : ''}`}>
      <div className="result-position">
        <span className="position-number">{getMedalEmoji(index)}</span>
      </div>

      <div className="result-player">
        <span className="player-name">
          {result.user?.username || 'Anonimo'}
        </span>
        {/* Mostriamo il titolo del quiz solo nella classifica globale */}
        {!isQuizSpecific && result.quiz && (
          <span className="player-quiz">
            {result.quiz.title}
          </span>
        )}
      </div>

      <div className="result-stats">
        <div className="stat-item">
          <span className="stat-label">Punti</span>
          <span className="stat-value score">{result.score}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Corrette</span>
          <span className="stat-value">
            {result.correctAnswers}/{result.totalQuestions}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Perc.</span>
          <span 
            className="stat-value percentage"
            style={{ color: getPerformanceColor(result.percentage) }}
          >
            {result.percentage}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default LeaderboardRow;