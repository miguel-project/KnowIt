const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware per proteggere le route
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Controlla se c'è il token nell'header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Estrae il token: "Bearer TOKEN" -> "TOKEN"
      token = req.headers.authorization.split(' ')[1];
    }

    // Se non c'è token
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Non autorizzato - Token mancante' 
      });
    }

    try {
      // Verifica il token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Trova l'utente e salvalo in req.user
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ 
          success: false,
          message: 'Utente non trovato' 
        });
      }

      next(); // Passa al prossimo middleware/route

    } catch (error) {
      return res.status(401).json({ 
        success: false,
        message: 'Non autorizzato - Token non valido' 
      });
    }

  } catch (error) {
    console.error('Errore middleware auth:', error);
    res.status(500).json({ 
      success: false,
      message: 'Errore di autenticazione',
      error: error.message 
    });
  }
};

// Middleware OPZIONALE: estrae user se c'è token, ma non blocca se manca
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    // Controlla se c'è il token nell'header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];

      try {
        // Verifica il token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Trova l'utente e salvalo in req.user
        req.user = await User.findById(decoded.id).select('-password');


      } catch (error) {
        // Token non valido, ma non blocchiamo la richiesta
        console.log('⚠️ Token non valido:', error.message);
        req.user = null;
      }

    } else {
      // Nessun token, ma continuiamo comunque
      console.log('ℹ️ Nessun token Authorization');
      req.user = null;
    }

    console.log('🏁 optionalAuth - req.user finale:', req.user ? req.user.username : 'null');
    next(); // Passa sempre al prossimo middleware

  } catch (error) {
    console.error('❌ Errore in optionalAuth:', error);
    req.user = null;
    next(); // Continua comunque
  }
};

// Middleware per verificare se l'utente è admin
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      success: false,
      message: 'Accesso negato - Solo amministratori' 
    });
  }
};