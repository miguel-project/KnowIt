import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../App.css';

function HomePage() {
  const [backendStatus, setBackendStatus] = useState('🔄 Verificando...');
  const [pinCode, setPinCode] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.testConnection()
      .then(data => setBackendStatus('✅ ' + data.message))
      .catch(() => setBackendStatus('❌ Backend non raggiungibile'));
  }, []);

  const handleJoinGame = () => {
    if (pinCode.trim()) {
      alert(`Tentativo di unirsi al gioco con PIN: ${pinCode}`);
    } else {
      alert('Inserisci un PIN valido!');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="logo">KnowIt</div>
        <ul className="nav-menu">
          <li onClick={() => navigate('/')}>Home</li>
          <li>Classifica Globale</li>
          <li>Chi Siamo</li>
          <li>FAQ</li>
          <li>Contatti</li>
          
          {user ? (
            <>
              <li>👤 {user.username}</li>
              <li className="accedi" onClick={handleLogout}>Esci</li>
            </>
          ) : (
            <li className="accedi" onClick={() => navigate('/login')}>Accedi</li>
          )}
        </ul>
      </nav>

      <main className="main-content">
        <div className="status-badge">{backendStatus}</div>

        {user && (
          <div className="welcome-message">
            Benvenuto, <strong>{user.username}</strong>! 👋
          </div>
        )}

        <h1>Benvenuto nella Web App Quiz!</h1>
        <p className="subtitle">Crea, gioca e sfida i tuoi amici</p>
        
        <section className="booking-section">
          <h2>📌 Unisciti a una Partita</h2>
          <div className="pin-container">
            <input 
              type="text" 
              placeholder="Inserisci PIN" 
              className="pin-input"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value.toUpperCase())}
              maxLength={6}
            />
            <button className="join-button" onClick={handleJoinGame}>
              Unisciti
            </button>
          </div>
        </section>

        <section className="game-options">
          <div className="game-option">
            <div className="option-icon">🎯</div>
            <h3>Modalità cooperativa</h3>
            <p>Modalità classica con domande progressive</p>
            <button className="category-button">Inizia</button>
          </div>

          <div className="game-option">
            <div className="option-icon">⚡</div>
            <h3>Modalità sfida</h3>
            <p>Modalità veloce contro il tempo</p>
            <button className="category-button">Inizia</button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© 2025 Kahoot-Like App - Progetto Fondamenti Web</p>
        <p className="footer-info">Realizzato da Antonio Marinotti, Giovanni Grimaldi, Michele Santopietro</p>
      </footer>
    </div>
  );
}

export default HomePage;