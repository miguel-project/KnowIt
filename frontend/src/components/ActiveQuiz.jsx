import React from 'react';

function ActiveQuiz({ 
  question, 
  questionIndex, 
  totalQuestions, 
  score, 
  onAnswer, 
  showFeedback, 
  selectedAnswer 
}) {
  const progressPercentage = ((questionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="active-quiz-container">
      <div className="game-header">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="game-stats">
          <span>Domanda {questionIndex + 1}/{totalQuestions}</span>
          <span>🏆 Punteggio: {score}</span>
        </div>
      </div>

      <div className="question-card">
        <div className="question-header">
          <h2>❓ {question.questionText}</h2>
          <div className="question-points">{question.points} punti</div>
        </div>

        <div className="options-grid">
          {question.options.map((option, index) => {
            let optionClass = 'option-btn';
            
            // Gestione dei colori per il feedback (corretta/sbagliata)
            if (showFeedback) {
              if (index === question.correctAnswer) {
                optionClass += ' correct';
              } else if (index === selectedAnswer) {
                optionClass += ' incorrect';
              } else {
                optionClass += ' disabled';
              }
            }

            return (
              <button
                key={index}
                className={optionClass}
                onClick={() => onAnswer(index)}
                disabled={showFeedback}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
              </button>
            );
          })}
        </div>

        {showFeedback && question.explanation && (
          <div className="explanation">
            <strong>💡 Spiegazione:</strong> {question.explanation}
          </div>
        )}
      </div>
    </div>
  );
}

export default ActiveQuiz;