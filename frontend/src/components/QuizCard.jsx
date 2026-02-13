import React from 'react';

// Aggiungiamo 'onDetails' tra le props ricevute
function QuizCard({ quiz, onPlay, onDetails }) {
  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'facile': return '#4CAF50';
      case 'medio': return '#FF9800';
      case 'difficile': return '#F44336';
      default: return '#999';
    }
  };

  return (
    <div className="quiz-card">
      <div className="quiz-card-header">
        <span className="quiz-category">{quiz.category}</span>
        <span 
          className="quiz-difficulty"
          style={{ backgroundColor: getDifficultyColor(quiz.difficulty) }}
        >
          {quiz.difficulty}
        </span>
      </div>

      <h3 className="quiz-title">{quiz.title}</h3>
      <p className="quiz-description">
        {quiz.description.length > 80 
          ? quiz.description.substring(0, 80) + '...' 
          : quiz.description}
      </p>

      <div className="quiz-meta">
        <span>❓ {quiz.questions?.length || 0} domande</span>
        <span>👤 {quiz.createdBy?.username || 'Anonimo'}</span>
      </div>

      {/* Raggruppiamo i pulsanti in un div 'quiz-actions' per stile */}
      <div className="quiz-actions">
        <button className="play-btn" onClick={() => onPlay(quiz._id)}>
          🎮 Gioca
        </button>
        
        {/* Mostriamo il pulsante Dettagli solo se la callback viene passata dal genitore */}
        {onDetails && (
          <button className="details-btn" onClick={() => onDetails(quiz._id)}>
            📖 Dettagli
          </button>
        )}
      </div>
    </div>
  );
}

export default QuizCard;