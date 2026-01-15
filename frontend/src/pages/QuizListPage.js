import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllQuizzes } from '../services/api';
import './QuizListPage.css';

function QuizListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    search: ''
  });

  useEffect(() => {
    console.log('useEffect triggered - loadQuizzes()');
    loadQuizzes();
  }, []);

  const loadQuizzes = async (filterParams = {}) => {
    setLoading(true);
    setError('');
    
    try {
      console.log('API call - filters:', filterParams);
      const data = await getAllQuizzes(filterParams);
      
      console.log('═══════════════════════════════');
      console.log('BACKEND RESPONSE');
      console.log('═══════════════════════════════');
      console.log('Success:', data.success);
      console.log('Count:', data.count);
      console.log('Quizzes length:', data.quizzes?.length);
      console.log('Quizzes:', data.quizzes);
      console.log('═══════════════════════════════\n');
      
      setQuizzes(data.quizzes);
    } catch (err) {
      console.error('❌ ERROR:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    loadQuizzes(newFilters);
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'facile': return '#4CAF50';
      case 'medio': return '#FF9800';
      case 'difficile': return '#F44336';
      default: return '#999';
    }
  };
  
  console.log('RENDER - loading:', loading, '| quizzes:', quizzes.length);
  
  return (
    <div className="quiz-list-container">
      <div className="quiz-list-header">
        <h1>📚 Quiz Disponibili</h1>
        {user && (
          <button 
            className="create-quiz-btn"
            onClick={() => navigate('/create-quiz')}
          >
            ➕ Crea Nuovo Quiz
          </button>
        )}
      </div>

      {/* Filtri */}
      <div className="quiz-filters">
        <input
          type="text"
          name="search"
          placeholder="🔍 Cerca quiz..."
          value={filters.search}
          onChange={handleFilterChange}
          className="search-input"
        />

        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">Tutte le Categorie</option>
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

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Caricamento quiz...</div>
      ) : quizzes.length === 0 ? (
        <div className="no-quizzes">
          <p>😔 Nessun quiz trovato</p>
          {user && (
            <button onClick={() => navigate('/create-quiz')} className="create-quiz-btn">
              Crea il Primo Quiz
            </button>
          )}
        </div>
      ) : (
        <div className="quiz-grid">
          {console.log('Rendering', quizzes.length, 'quiz cards')}
          {quizzes.map(quiz => (
            <div key={quiz._id} className="quiz-card">
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
              <p className="quiz-description">{quiz.description}</p>

              <div className="quiz-stats">
                <span>❓ {quiz.questions?.length || 0} domande</span>
                <span>👤 {quiz.createdBy?.username || 'Anonimo'}</span>
              </div>

              <div className="quiz-actions">
                <button 
                  className="play-btn"
                  onClick={() => navigate(`/play/${quiz._id}`)}
                >
                  🎮 Gioca
                </button>
                <button 
                  className="details-btn"
                  onClick={() => navigate(`/quiz/${quiz._id}`)}
                >
                  📖 Dettagli
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuizListPage;