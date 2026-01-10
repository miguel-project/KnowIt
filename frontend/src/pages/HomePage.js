import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { testConnection } from '../services/api';
import './HomePage.css'; 


function HomePage() {
  const [backendStatus, setBackendStatus] = useState('🔄 Verificando...');
  const [pinCode, setPinCode] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    testConnection()
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

  return (
    <>
      <div className="status-badge">{backendStatus}</div>
      
      {user && (
        <div className="welcome-message">
          Benvenuto, <strong>{user.username}</strong>! 👋
        </div>
      )}

      <h1>Benvenuto in KnowIt!</h1>
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
          <h3>Modalità Cooperativa</h3>
          <p>Modalità classica con domande progressive</p>
          <button className="category-button">Inizia</button>
        </div>

        <div className="game-option">
          <div className="option-icon">⚡</div>
          <h3>Modalità Sfida</h3>
          <p>Modalità veloce contro il tempo</p>
          <button className="category-button">Inizia</button>
        </div>
      </section>
    </>
  );
}

export default HomePage;