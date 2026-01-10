import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createQuiz, addQuestion } from '../services/api';
import '/CreateQuizPage.css';

function CreateQuizPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Step 1: Info Quiz
  const [step, setStep] = useState(1);
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    category: 'Cultura Generale',
    difficulty: 'medio',
    isPublic: true
  });

  // Step 2: Domande
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    points: 10,
    timeLimit: 30,
    explanation: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdQuizId, setCreatedQuizId] = useState(null);

  // Handler Step 1: Info Quiz
  const handleQuizDataChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuizData({
      ...quizData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleNextStep = () => {
    if (!quizData.title || !quizData.description) {
      setError('Titolo e descrizione sono obbligatori');
      return;
    }
    setError('');
    setStep(2);
  };

  // Handler Step 2: Domande
  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuestion({
      ...currentQuestion,
      [name]: value
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions
    });
  };

  const addQuestionToList = () => {
    // Validazione
    if (!currentQuestion.questionText) {
      setError('Il testo della domanda è obbligatorio');
      return;
    }

    const filledOptions = currentQuestion.options.filter(opt => opt.trim() !== '');
    if (filledOptions.length < 2) {
      setError('Devi avere almeno 2 opzioni di risposta');
      return;
    }

    setError('');
    setQuestions([...questions, { ...currentQuestion, options: filledOptions }]);
    
    // Reset form domanda
    setCurrentQuestion({
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 10,
      timeLimit: 30,
      explanation: ''
    });
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // Submit finale
  const handleSubmit = async () => {
    if (questions.length === 0) {
      setError('Devi aggiungere almeno una domanda');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Crea il quiz
      const quizResponse = await createQuiz(quizData);
      const quizId = quizResponse.quiz._id;
      setCreatedQuizId(quizId);

      // 2. Aggiungi tutte le domande
      for (const question of questions) {
        await addQuestion(quizId, question);
      }

      alert('✅ Quiz creato con successo!');
      navigate(`/quiz/${quizId}`);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Se non loggato, reindirizza
  if (!user) {
    return (
      <div className="auth-container">
        <h2>Accesso Negato</h2>
        <p>Devi essere loggato per creare un quiz.</p>
        <button onClick={() => navigate('/login')} className="auth-button">
          Accedi
        </button>
      </div>
    );
  }

  return (
    <div className="create-quiz-container">
      <h1>✨ Crea un Nuovo Quiz</h1>

      {error && <div className="error-message">{error}</div>}

      {/* STEP 1: Info Quiz */}
      {step === 1 && (
        <div className="quiz-form">
          <h2>📋 Informazioni Quiz</h2>

          <div className="form-group">
            <label>Titolo *</label>
            <input
              type="text"
              name="title"
              value={quizData.title}
              onChange={handleQuizDataChange}
              placeholder="Es: Capitali del Mondo"
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label>Descrizione *</label>
            <textarea
              name="description"
              value={quizData.description}
              onChange={handleQuizDataChange}
              placeholder="Descrivi il tuo quiz..."
              rows={4}
              maxLength={500}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Categoria</label>
              <select name="category" value={quizData.category} onChange={handleQuizDataChange}>
                <option value="Geografia">Geografia</option>
                <option value="Storia">Storia</option>
                <option value="Scienza">Scienza</option>
                <option value="Sport">Sport</option>
                <option value="Cultura Generale">Cultura Generale</option>
                <option value="Tecnologia">Tecnologia</option>
                <option value="Arte">Arte</option>
                <option value="Musica">Musica</option>
              </select>
            </div>

            <div className="form-group">
              <label>Difficoltà</label>
              <select name="difficulty" value={quizData.difficulty} onChange={handleQuizDataChange}>
                <option value="facile">Facile</option>
                <option value="medio">Medio</option>
                <option value="difficile">Difficile</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="isPublic"
                checked={quizData.isPublic}
                onChange={handleQuizDataChange}
              />
              Quiz pubblico (visibile a tutti)
            </label>
          </div>

          <button onClick={handleNextStep} className="next-btn">
            Avanti ➡️
          </button>
        </div>
      )}

      {/* STEP 2: Domande */}
      {step === 2 && (
        <div className="questions-form">
          <div className="step-header">
            <button onClick={() => setStep(1)} className="back-btn">
              ⬅️ Indietro
            </button>
            <h2>❓ Aggiungi Domande ({questions.length})</h2>
          </div>

          {/* Form nuova domanda */}
          <div className="question-form">
            <div className="form-group">
              <label>Testo Domanda *</label>
              <input
                type="text"
                name="questionText"
                value={currentQuestion.questionText}
                onChange={handleQuestionChange}
                placeholder="Scrivi la domanda..."
                maxLength={500}
              />
            </div>

            <div className="form-group">
              <label>Opzioni di Risposta * (minimo 2)</label>
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="option-input">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Opzione ${index + 1}`}
                  />
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={currentQuestion.correctAnswer === index}
                    onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: index })}
                  />
                  <span>Corretta</span>
                </div>
              ))}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Punti</label>
                <input
                  type="number"
                  name="points"
                  value={currentQuestion.points}
                  onChange={handleQuestionChange}
                  min="1"
                  max="100"
                />
              </div>

              <div className="form-group">
                <label>Tempo (secondi)</label>
                <input
                  type="number"
                  name="timeLimit"
                  value={currentQuestion.timeLimit}
                  onChange={handleQuestionChange}
                  min="5"
                  max="120"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Spiegazione (opzionale)</label>
              <textarea
                name="explanation"
                value={currentQuestion.explanation}
                onChange={handleQuestionChange}
                placeholder="Spiega la risposta corretta..."
                rows={2}
                maxLength={300}
              />
            </div>

            <button onClick={addQuestionToList} className="add-question-btn">
              ➕ Aggiungi Domanda
            </button>
          </div>

          {/* Lista domande aggiunte */}
          {questions.length > 0 && (
            <div className="questions-list">
              <h3>Domande Aggiunte:</h3>
              {questions.map((q, index) => (
                <div key={index} className="question-item">
                  <div>
                    <strong>Q{index + 1}:</strong> {q.questionText}
                    <div className="question-meta">
                      {q.options.length} opzioni • {q.points} punti • {q.timeLimit}s
                    </div>
                  </div>
                  <button onClick={() => removeQuestion(index)} className="remove-btn">
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}

          <button 
            onClick={handleSubmit} 
            className="submit-quiz-btn"
            disabled={loading || questions.length === 0}
          >
            {loading ? 'Creazione in corso...' : '✅ Crea Quiz'}
          </button>
        </div>
      )}
    </div>
  );
}

export default CreateQuizPage;