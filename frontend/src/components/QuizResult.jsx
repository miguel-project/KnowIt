import React from 'react';

function QuizResult({ stats, score, onReplay, onBack, onDetails, user, resultSaved }) {
  return (
    <div className="results-screen">
      <h1>🎉 Quiz Completato!</h1>

      <div className="final-score">
        <div className="score-circle">
          <span className="score-number">{score}</span>
          <span className="score-label">Punti</span>
        </div>
        <div className="score-percentage">
          {stats.percentage}%
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{stats.correctAnswers}</div>
          <div className="stat-label">Corrette</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-value">
            {stats.totalQuestions - stats.correctAnswers}
          </div>
          <div className="stat-label">Sbagliate</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-value">{stats.maxScore}</div>
          <div className="stat-label">Max Punti</div>
        </div>
      </div>

      <div className="performance-message">
        {stats.percentage >= 90 && '🌟 Eccezionale! Sei un esperto!'}
        {stats.percentage >= 70 && stats.percentage < 90 && '👏 Ottimo lavoro!'}
        {stats.percentage >= 50 && stats.percentage < 70 && '👍 Buon risultato!'}
        {stats.percentage < 50 && '💪 Continua a provare!'}
      </div>

      <div className="results-actions">
        <button className="replay-btn" onClick={onReplay}>
          🔄 Riprova
        </button>
        <button className="back-btn-secondary" onClick={onBack}>
          📚 Altri Quiz
        </button>
        {/* TASTO DETTAGLI QUIZ RIPRISTINATO */}
        <button className="details-btn-secondary" onClick={onDetails}>
          📖 Dettagli Quiz
        </button>
      </div>

      {user && resultSaved && (
        <div className="save-score-info">
          ✅ Il tuo punteggio è stato salvato!
        </div>
      )}

      {user && !resultSaved && (
        <div className="save-score-info saving">
          💾 Salvataggio in corso...
        </div>
      )}
    </div>
  );
}

export default QuizResult;