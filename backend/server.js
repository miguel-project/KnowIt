const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${req.path}`);
  next();
});

// Prima di app.use('/api/auth', ...)
const authRoutes = require('./routes/auth');
console.log('authRoutes:', typeof authRoutes);  // Deve dire "function"

app.use('/api/auth', authRoutes);


// ✅ ROUTES (NECESSARIE!)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/results', require('./routes/resultsRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'Backend funzionante!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// ✅ VARIABILI (DOPO I MIDDLEWARE, PRIMA DELLA CONNESSIONE)
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;

// ✅ CONNESSIONE MONGODB E AVVIO SERVER (NECESSARI!)
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connesso');
    app.listen(PORT, () => {
      console.log(`✅ Server su http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Errore MongoDB:', err.message);
    process.exit(1);
  });

module.exports = app;