import React from 'react';

function QuestionForm({ question, index, onUpdate, onRemove }) {
  
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    onUpdate(index, name, value);
  };

  const handleOptionChange = (optIndex, value) => {
    const newOptions = [...question.options];
    newOptions[optIndex] = value;
    onUpdate(index, 'options', newOptions);
  };

  return (
    <div className="question-form">
      <div className="question-form-header" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
        <h4 style={{ margin: 0 }}>Domanda {index + 1}</h4>
        <button 
          type="button" 
          className="remove-btn" 
          onClick={() => onRemove(index)}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '1.2rem', 
            color: '#f44336', /* Colore Rosso per il cestino */
            padding: 0
          }}
          title="Rimuovi domanda"
        >
          🗑️
        </button>
      </div>

      <div className="form-group">
        <label>Testo Domanda *</label>
        <input
          type="text"
          name="questionText"
          value={question.questionText}
          onChange={handleFieldChange}
          placeholder="Scrivi la domanda..."
        />
      </div>

      <div className="form-group">
        <label>Opzioni di Risposta * (seleziona la corretta)</label>
        {question.options.map((option, optIndex) => (
          <div key={optIndex} className="option-input" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(optIndex, e.target.value)}
              placeholder={`Opzione ${optIndex + 1}`}
              style={{ flex: 1 }}
            />
            <input
              type="radio"
              name={`correctAnswer-${index}`}
              checked={question.correctAnswer === optIndex}
              onChange={() => onUpdate(index, 'correctAnswer', optIndex)}
            />
            <span style={{ fontSize: '0.9rem' }}>Corretta</span>
          </div>
        ))}
      </div>

      <div className="form-row" style={{ display: 'flex', gap: '20px' }}>
        <div className="form-group">
          <label>Punti</label>
          <input
            type="number"
            name="points"
            value={question.points}
            onChange={handleFieldChange}
            min="1"
            max="100"
            style={{ width: '80px' }}
          />
        </div>
      </div>

      <div className="form-group" style={{ marginTop: '10px' }}>
        <label>Spiegazione (opzionale)</label>
        <textarea
          name="explanation"
          value={question.explanation}
          onChange={handleFieldChange}
          placeholder="Spiega la risposta corretta..."
          rows={2}
        />
      </div>
    </div>
  );
}

export default QuestionForm;