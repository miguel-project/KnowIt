import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { AuthProvider} from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/loginPage';
import RegisterPage from './pages/RegisterPage';
import './App.css';
import QuizDetailPage from './pages/QuizDetailPage';
import QuizListPage from './pages/QuizListPage';
import CreateQuizPage from './pages/CreateQuizPage';
import PlayQuizPage from './pages/PlayQuizPage';
import LeaderboardPage from './pages/LeaderboardPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';


// Componente principale
function AppContent() {
  return (
    <div className="App">
      <Navbar />
      
      <main className="main-content">
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/quizzes" element={<QuizListPage />} />
            <Route path="/create-quiz" element={<CreateQuizPage />} />
            <Route path="/quiz/:id" element={<QuizDetailPage />} /> 
            <Route path="/play/:id" element={<PlayQuizPage />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/leaderboard" element={<LeaderboardPage key="global" />} />
            <Route path="/leaderboard/:quizId" element={<LeaderboardPage key="quiz" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

// Wrap con Router e AuthProvider
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;