import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [backendStatus, setBackendStatus] = useState('🔄 Verificando...');
  const [pinCode, setPinCode] = useState('');

  useEffect(() => {
    // Test connessione backend
    fetch('http://localhost:5001')
      .then(res => res.json())
      .then(data => setBackendStatus('✅ ' + data.message))
      .catch(err => setBackendStatus('❌ Backend non raggiungibile'));
  }, []);

  const handleJoinGame = () => {
    if (pinCode.trim()) {
      alert(`Tentativo di unirsi al gioco con PIN: ${pinCode}`);
    } else {
      alert('Inserisci un PIN valido!');
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="logo">KnowIt</div>
        <ul className="nav-menu">
          <li>Home</li>
          <li>Classifica Globale</li>
          <li>Chi Siamo</li>
          <li>FAQ</li>
          <li>Contatti</li>
          <li className="accedi">Accedi</li>
        </ul>
      </nav>

      <main className="main-content">
        {/*<div className="status-badge">
          {backendStatus}
        </div>  UTILE PER VERIFICARE LO STATO DI CONNESSIONE BACKEND*/}

        <h1>Benvenuto in KnowIt!</h1>
        <p className="subtitle">Crea, gioca e sfida i tuoi amici</p>
        
        <section className="booking-section">
          <h2>Unisciti a una Partita</h2>
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
        <p>© 2025 KnowIt - Progetto Fondamenti Web</p>
        <p className="footer-info">Realizzato da Antonio Marinotti, Giovanni Grimaldi, Michele Santopietro</p>
      </footer>
    </div>
  );
}

export default App;
