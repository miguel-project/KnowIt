const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Funzione per generare JWT token
const generateToken = (userId) => {
  return jwt.sign(  //funzione per creare il token
    { id: userId }, //payload del token
    process.env.JWT_SECRET,    //chiave per firmare il token
    { expiresIn: '7d' }  // Token valido per 7 giorni
  );
};

// Registrazione nuovo utente
// POST /api/auth/register
// Public
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validazione input
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Tutti i campi sono obbligatori' 
      });
    }

    // Controlla se utente già esiste
    const userExists = await User.findOne({ 
      $or: [{ email }, { username }] //operando OR tra email e username
    });

    if (userExists) {
      return res.status(400).json({ 
        success: false,
        message: 'Utente già registrato' 
      });
    }

    // Crea nuovo utente (la password viene hash-ata automaticamente nel model User tramite il middleware pre('save') )
    const user = await User.create({
      username,
      email,
      password
    });

    // Genera token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registrazione completata!',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Errore registrazione:', error);
    res.status(500).json({ 
      success: false,
      message: 'Errore durante la registrazione',
      error: error.message 
    });
  }
};

// Login utente
// POST /api/auth/login
// Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validazione input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email e password sono obbligatorie' 
      });
    }

    // Trova utente
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Credenziali non valide' 
      });
    }

    // Verifica password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Credenziali non valide' 
      });
    }

    // Genera token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login effettuato!',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Errore login:', error);
    res.status(500).json({ 
      success: false,
      message: 'Errore durante il login',
      error: error.message 
    });
  }
};

// Ottieni dati utente loggato
// GET /api/auth/me
// Private (richiede token)
exports.getMe = async (req, res) => {
  try {
    // req.user è stato aggiunto dal middleware di autenticazione
    const user = await User.findById(req.user.id).select('-password');   //esclude il campo password dalla risposta

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Errore getMe:', error);
    res.status(500).json({ 
      success: false,
      message: 'Errore nel recupero dati utente',
      error: error.message 
    });
  }
};