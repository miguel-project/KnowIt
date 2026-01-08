const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Route pubbliche (non richiedono autenticazione)
router.post('/register', register);
router.post('/login', login);

// Route protette (richiedono token)
router.get('/me', protect, getMe);

module.exports = router;