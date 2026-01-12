const express = require('express');
const router = express.Router();
const {
  saveResult,
  getQuizResults,
  getUserResults,
  getGlobalStats,
  deleteResult
} = require('../controllers/resultController');
const { protect } = require('../middleware/auth');

// Rotte pubbliche
router.get('/quiz/:quizId', getQuizResults);
router.get('/stats/global', getGlobalStats);

// Rotte protette
router.post('/', protect, saveResult);
router.get('/user/:userId', protect, getUserResults);
router.delete('/:id', protect, deleteResult);

module.exports = router;