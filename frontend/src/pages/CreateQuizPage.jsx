import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createQuiz, addQuestion as apiAddQuestion } from '../services/api';
import QuestionForm from '../components/QuestionForm'; // Il figlio con la vecchia formattazione
import '../styles/CreateQuizPage.css';

function CreateQuizPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    category: 'Cultura Generale',
    difficulty: 'medio',
    isPublic: true
  });

  const [questions, setQuestions] = useState([]); // Array delle domande
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handler Step 1 (Info Quiz)
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
    // Se la lista è vuota, aggiungiamo la prima domanda pronta per essere scritta
    if (questions.length === 0) {
      addQuestionSlot();
    }
    setStep(2);
  };

  // Funzione per aggiungere un nuovo "banner" domanda
  const addQuestionSlot = () => {
    const newQuestion = {
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 10,
      explanation: ''
    };
    setQuestions([...questions, newQuestion]);
  };

  // CALLBACK: aggiorna i dati della domanda specifica
  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  // CALLBACK: rimuove la domanda
  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (questions.length === 0) {
      setError('Devi aggiungere almeno una domanda');
      return;
    }

    setLoading(true);
    try {
      const quizResponse = await createQuiz(quizData);
      const quizId = quizResponse.quiz._id;

      for (const q of questions) {
        await apiAddQuestion(quizId, q);
      }

      navigate(`/quiz/${quizId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="auth-container"><h2>Accesso Negato</h2></div>;

  return (
    <div className="create-quiz-container">
      <h1>✨ Crea un Nuovo Quiz</h1>
      {error && <div className="error-message">{error}</div>}

      {/* STEP 1: Formattazione originale con isPublic e Categorie */}
      {step === 1 && (
        <div className="quiz-form">
          <h2>📋 Informazioni Quiz</h2>
          <div className="form-group">
            <label>Titolo *</label>
            <input type="text" name="title" value={quizData.title} onChange={handleQuizDataChange} maxLength={100} />
          </div>
          <div className="form-group">
            <label>Descrizione *</label>
            <textarea name="description" value={quizData.description} onChange={handleQuizDataChange} rows={4} maxLength={500} />
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
            <label className="checkbox-label">
              <input type="checkbox" name="isPublic" checked={quizData.isPublic} onChange={handleQuizDataChange} />
              Quiz pubblico (visibile a tutti)
            </label>
          </div>
          <button onClick={handleNextStep} className="next-btn">Avanti ➡️</button>
        </div>
      )}

      {/* STEP 2: Lista di "Banner" domande (Components) */}
      {step === 2 && (
        <div className="questions-form">
          <div className="step-header">
            <button onClick={() => setStep(1)} className="back-btn">⬅️ Indietro</button>
            <h2>Inserisci le domande</h2>
          </div>

          <div className="questions-container">
            {questions.map((q, index) => (
              <QuestionForm
                key={index}
                index={index}
                question={q}
                onUpdate={updateQuestion} // Callback 'cb' al figlio
                onRemove={removeQuestion} // Callback 'cb' al figlio
              />
            ))}
          </div>

          <button type="button" onClick={addQuestionSlot} className="add-question-btn">
            ➕ Aggiungi un'altra domanda
          </button>

          <button onClick={handleSubmit} className="submit-quiz-btn" disabled={loading || questions.length === 0}>
            {loading ? 'Salvataggio...' : '✅ Pubblica Quiz'}
          </button>
        </div>
      )}
    </div>
  );
}

export default CreateQuizPage;