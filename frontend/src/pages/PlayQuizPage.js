import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getQuizById } from '../services/api';
import './PlayQuizPage.css';

function PlayQuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Stati principali
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Stati del gioco
  const [gameState, setGameState] = useState('intro'); // intro, playing, finished
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  // Carica quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await getQuizById(id);
        if (data.quiz.questions.length === 0) {
          setError('Questo quiz non ha domande!');
          return;
        }
        setQuiz(data.quiz);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  // Inizia il gioco
  const startGame = () => {
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers([]);
  };

  // Gestisci risposta
  const handleAnswer = (answerIndex) => {
    if (showFeedback) return;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    // Calcola punti
    const points = isCorrect ? currentQuestion.points : 0

    // Salva risposta
    const answerData = {
      questionId: currentQuestion._id,
      selectedAnswer: answerIndex,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      points,
    };

    setAnswers([...answers, answerData]);
    setScore(score + points);
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);

    // Avanza dopo 2 secondi
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  // Prossima domanda
  const nextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex >= quiz.questions.length) {
      // Fine quiz
      setGameState('finished');
    } else {
      // Prossima domanda
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  // Rigioca
  const handleReplay = () => {
    setGameState('intro');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setAnswers([]);
  };

  // Calcola statistiche finali
  const getFinalStats = () => {
    const totalQuestions = quiz.questions.length;
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const maxScore = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = Math.round((score / maxScore) * 100);

    return { totalQuestions, correctAnswers, maxScore, percentage};
  };

  if (loading) {
    return <div className="loading">Caricamento quiz...</div>;
  }

  if (error) {
    return (
      <div className="play-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/quizzes')} className="back-btn">
          ← Torna ai Quiz
        </button>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="play-container">
        <h2>Quiz non trovato</h2>
        <button onClick={() => navigate('/quizzes')} className="back-btn">
          ← Torna ai Quiz
        </button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  // SCHERMATA INTRO
  if (gameState === 'intro') {
    return (
      <div className="play-container">
        <div className="intro-screen">
          <h1>🎮 {quiz.title}</h1>
          <p className="quiz-description">{quiz.description}</p>

          <div className="quiz-info">
            <div className="info-item">
              <span className="info-icon">❓</span>
              <span>{quiz.questions.length} Domande</span>
            </div>
            <div className="info-item">
              <span className="info-icon">🏆</span>
              <span>
                {quiz.questions.reduce((sum, q) => sum + q.points, 0)} Punti Totali
              </span>
            </div>
          </div>

          <div className="intro-rules">
            <h3>📋 Regole:</h3>
            <ul>
              <li>Rispondi a tutte le domande </li>
              <li>Non puoi tornare indietro</li>
              <li>Buona fortuna! 🍀</li>
            </ul>
          </div>

          <button className="start-btn" onClick={startGame}>
            🚀 Inizia Quiz
          </button>

          <button 
            className="back-btn-secondary"
            onClick={() => navigate(`/quiz/${id}`)}
          >
            ← Torna al Dettaglio
          </button>
        </div>
      </div>
    );
  }

  // SCHERMATA GIOCO
  if (gameState === 'playing') {
    const progressPercentage = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

    return (
      <div className="play-container">
        <div className="game-header">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="game-stats">
            <span>
              Domanda {currentQuestionIndex + 1}/{quiz.questions.length}
            </span>
            <span>🏆 Punteggio: {score}</span>
          </div>
        </div>

        <div className="question-card">
          <div className="question-header">
            <h2>❓ {currentQuestion.questionText}</h2>
            <div className="question-points">
              {currentQuestion.points} punti
            </div>
          </div>

          <div className="options-grid">
            {currentQuestion.options.map((option, index) => {
              let optionClass = 'option-btn';
              
              if (showFeedback) {
                if (index === currentQuestion.correctAnswer) {
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
                  onClick={() => handleAnswer(index)}
                  disabled={showFeedback}
                >
                  <span className="option-letter">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="option-text">{option}</span>
                </button>
              );
            })}
          </div>

          {showFeedback && currentQuestion.explanation && (
            <div className="explanation">
              <strong>💡 Spiegazione:</strong> {currentQuestion.explanation}
            </div>
          )}
        </div>
      </div>
    );
  }

  // SCHERMATA FINALE
  if (gameState === 'finished') {
    const stats = getFinalStats();

    return (
      <div className="play-container">
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
            <button className="replay-btn" onClick={handleReplay}>
              🔄 Riprova
            </button>
            <button 
              className="back-btn-secondary"
              onClick={() => navigate('/quizzes')}
            >
              📚 Altri Quiz
            </button>
            <button 
              className="details-btn-secondary"
              onClick={() => navigate(`/quiz/${id}`)}
            >
              📖 Dettagli Quiz
            </button>
          </div>

          {user && (
            <div className="save-score-info">
              💾 Il tuo punteggio è stato salvato!
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

export default PlayQuizPage;