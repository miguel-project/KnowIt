const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// ============================================
// CORS CONFIGURATION
// ============================================
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// ============================================
// MIDDLEWARE
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log delle richieste
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${req.path}`);
  next();
});

// ============================================
// ROUTES
// ============================================

// Home route - Test connessione
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend Kahoot-like funzionante!',
    version: '1.0.0',
    timestamp: new Date(),
    status: 'OK'
  });
});

// Health check
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({ 
    status: 'OK',
    database: dbStatus,
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Test API
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API funzionante!',
    timestamp: new Date()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route non trovata',
    path: req.path,
    method: req.method
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Errore:', err.message);
  console.error(err.stack);
  
  res.status(err.status || 500).json({ 
    error: 'Errore interno del server',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Si è verificato un errore'
  });
});

// ============================================
// DATABASE & SERVER START
// ============================================

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;

// Verifica variabili ambiente
if (!MONGODB_URI) {
  console.error('❌ ERRORE: MONGODB_URI non trovato nel file .env');
  console.error('Assicurati che il file .env esista e contenga MONGODB_URI');
  process.exit(1);
}

// Connessione MongoDB
console.log('🔄 Connessione a MongoDB in corso...');

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ MongoDB connesso con successo');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Avvia server solo dopo connessione DB
    app.listen(PORT, () => {
      console.log('');
      console.log('🚀 SERVER AVVIATO!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`📡 CORS: Abilitato per tutte le origini`);
      console.log(`🕐 Avviato: ${new Date().toLocaleString('it-IT')}`);
      console.log(`🔧 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
      console.log('📝 Routes disponibili:');
      console.log(`   GET  http://localhost:${PORT}/`);
      console.log(`   GET  http://localhost:${PORT}/health`);
      console.log(`   GET  http://localhost:${PORT}/api/test`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });
  })
  .catch((error) => {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ ERRORE CONNESSIONE MONGODB');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('Tipo errore:', error.name);
    console.error('Messaggio:', error.message);
    console.error('');
    
    // Suggerimenti basati sul tipo di errore
    if (error.message.includes('authentication failed') || error.message.includes('auth')) {
      console.error('💡 SOLUZIONE: Problema di autenticazione');
      console.error('   1. Verifica username e password in MongoDB Atlas');
      console.error('   2. Vai su: Database Access → Edit User → Reset Password');
      console.error('   3. Aggiorna MONGODB_URI nel file .env');
    } else if (error.message.includes('IP') || error.message.includes('not allowed')) {
      console.error('💡 SOLUZIONE: IP non autorizzato');
      console.error('   1. Vai su MongoDB Atlas → Network Access');
      console.error('   2. Add IP Address → Allow Access from Anywhere (0.0.0.0/0)');
      console.error('   3. Aspetta 1-2 minuti per la propagazione');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('💡 SOLUZIONE: URL del cluster non corretto');
      console.error('   1. Verifica MONGODB_URI nel file .env');
      console.error('   2. Copia nuovamente la connection string da MongoDB Atlas');
    } else {
      console.error('💡 SOLUZIONE: Errore generico');
      console.error('   1. Verifica che MongoDB Atlas sia attivo');
      console.error('   2. Controlla la connection string nel file .env');
      console.error('   3. Verifica la connessione internet');
    }
    
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(1);
  });

// Gestione eventi MongoDB
mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose connesso a MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Errore connessione Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  Mongoose disconnesso da MongoDB');
});

// Gestione chiusura applicazione
process.on('SIGINT', async () => {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('⚠️  Chiusura applicazione in corso...');
  
  try {
    await mongoose.connection.close();
    console.log('✅ Connessione MongoDB chiusa correttamente');
  } catch (err) {
    console.error('❌ Errore durante la chiusura:', err);
  }
  
  console.log('👋 Server terminato');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  process.exit(0);
});

// Export per testing
module.exports = app;