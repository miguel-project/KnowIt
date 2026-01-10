import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getQuizById, deleteQuiz } from '../services/api';
import './QuizDetailPage.css';

function QuizDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await getQuizById(id);
        setQuiz(data.quiz);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Sei sicuro di voler eliminare questo quiz?')) {
      try {
        await deleteQuiz(id);
        alert('✅ Quiz eliminato con successo!');
        navigate('/quizzes');
      } catch (err) {
        alert('❌ Errore: ' + err.message);
      }
    }
  };

  const handlePlay = () => {
    navigate(`/play/${id}`);
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'facile': return '#4CAF50';
      case 'medio': return '#FF9800';
      case 'difficile': return '#F44336';
      default: return '#999';
    }
  };

  if (loading) {
    return <div className="loading">Caricamento quiz...</div>;
  }

  if (error) {
    return (
      <div className="quiz-detail-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/quizzes')} className="back-btn">
          ← Torna ai Quiz
        </button>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="quiz-detail-container">
        <h2>Quiz non trovato</h2>
        <button onClick={() => navigate('/quizzes')} className="back-btn">
          ← Torna ai Quiz
        </button>
      </div>
    );
  }

  const isOwner = user && quiz.createdBy && (
    String(quiz.createdBy._id) === String(user.id) ||
    String(quiz.createdBy._id) === String(user._id)
  );

  return (
    <div className="quiz-detail-container">
      <button onClick={() => navigate('/quizzes')} className="back-btn">
        ← Torna ai Quiz
      </button>

      <div className="quiz-header">
        <div className="quiz-badges">
          <span className="quiz-category-badge">{quiz.category}</span>
          <span 
            className="quiz-difficulty-badge"
            style={{ backgroundColor: getDifficultyColor(quiz.difficulty) }}
          >
            {quiz.difficulty}
          </span>
        </div>

        <h1>{quiz.title}</h1>
        <p className="quiz-description">{quiz.description}</p>

        <div className="quiz-meta">
          <div className="meta-item">
            <span className="meta-icon">❓</span>
            <span>{quiz.questions?.length || 0} domande</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">👤</span>
            <span>Creato da: {quiz.createdBy?.username || 'Anonimo'}</span>
          </div>
          {quiz.totalPlays > 0 && (
            <div className="meta-item">
              <span className="meta-icon">🎮</span>
              <span>{quiz.totalPlays} partite giocate</span>
            </div>
          )}
        </div>

        <div className="quiz-actions">
          <button className="play-quiz-btn" onClick={handlePlay}>
            🎮 Gioca Ora
          </button>

          {isOwner && (
            <>
              <button 
                className="edit-quiz-btn"
                onClick={() => navigate(`/edit-quiz/${id}`)}
              >
                ✏️ Modifica
              </button>
              <button className="delete-quiz-btn" onClick={handleDelete}>
                🗑️ Elimina
              </button>
            </>
          )}
        </div>
      </div>

      {quiz.questions && quiz.questions.length > 0 ? (
        <div className="questions-preview">
          <h2>📋 Anteprima Domande</h2>
          <div className="questions-list">
            {quiz.questions.map((question, index) => (
              <div key={question._id} className="question-preview-card">
                <div className="question-number">Domanda {index + 1}</div>
                <div className="question-text">{question.questionText}</div>
                <div className="question-info">
                  <span>⏱️ {question.timeLimit}s</span>
                  <span>🏆 {question.points} punti</span>
                  <span>✅ {question.options?.length || 0} opzioni</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="no-questions">
          <p>😔 Questo quiz non ha ancora domande</p>
          {isOwner && (
            <button 
              className="add-questions-btn"
              onClick={() => navigate(`/edit-quiz/${id}`)}
            >
              ➕ Aggiungi Domande
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default QuizDetailPage;