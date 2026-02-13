import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getQuizById, saveResult } from '../services/api';
import ActiveQuiz from '../components/ActiveQuiz';
import QuizResult from '../components/QuizResult';
import '../styles/PlayQuizPage.css';

function PlayQuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [gameState, setGameState] = useState('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [resultSaved, setResultSaved] = useState(false);

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

  useEffect(() => {
    if (gameState === 'finished' && user && !resultSaved) {
      saveGameResult();
    }
  }, [gameState, user, resultSaved]);

  const startGame = () => {
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers([]);
  };

  const handleAnswer = (answerIndex) => {
    if (showFeedback) return;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const points = isCorrect ? currentQuestion.points : 0;

    const answerData = {
      questionId: currentQuestion._id,
      selectedAnswer: answerIndex,
      isCorrect,
      pointsEarned: points,
    };

    setAnswers(prevAnswers => [...prevAnswers, answerData]);
    setScore(prevScore => prevScore + points);
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);

    // Manteniamo il delay di 5 secondi del vecchio file
    setTimeout(() => {
      nextQuestion();
    }, 5000);
  };

  const nextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex >= quiz.questions.length) {
      setGameState('finished');
    } else {
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const handleReplay = () => {
    setGameState('intro');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setAnswers([]);
    setResultSaved(false);
  };

  const getFinalStats = () => {
    const totalQuestions = quiz.questions.length;
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const maxScore = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = Math.round((score / maxScore) * 100);
    return { totalQuestions, correctAnswers, maxScore, percentage };
  };

  const saveGameResult = async () => {
    if (!user) return;
    try {
      const stats = getFinalStats();
      const resultData = {
        quizId: quiz._id,
        score: score,
        maxScore: stats.maxScore,
        percentage: stats.percentage,
        correctAnswers: stats.correctAnswers,
        totalQuestions: stats.totalQuestions,
        answers: answers
      };
      await saveResult(resultData);
      setResultSaved(true);
    } catch (error) {
      setResultSaved(true);
    }
  };

  if (loading) return <div className="loading">Caricamento quiz...</div>;
  if (error || !quiz) return (
    <div className="play-container">
      <div className="error-message">{error || "Quiz non trovato"}</div>
      <button onClick={() => navigate('/quizzes')} className="back-btn">← Torna ai Quiz</button>
    </div>
  );

  // SCHERMATA INTRO ORIGINALE
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

  if (gameState === 'playing') {
    return (
      <div className="play-container">
        <ActiveQuiz 
          question={quiz.questions[currentQuestionIndex]}
          questionIndex={currentQuestionIndex}
          totalQuestions={quiz.questions.length}
          score={score}
          onAnswer={handleAnswer}
          showFeedback={showFeedback}
          selectedAnswer={selectedAnswer}
        />
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="play-container">
        <QuizResult 
          stats={getFinalStats()}
          score={score}
          onReplay={handleReplay}
          onBack={() => navigate('/quizzes')}
          onDetails={() => navigate(`/quiz/${id}`)} // Passiamo la callback per il tasto dettagli
          user={user}
          resultSaved={resultSaved}
        />
      </div>
    );
  }

  return null;
}

export default PlayQuizPage;