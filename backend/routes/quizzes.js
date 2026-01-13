const express = require('express');
const router = express.Router();
const {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  addQuestion,
  updateQuiz,
  deleteQuiz,
  getMyQuizzes
} = require('../controllers/quizController');
const { protect, optionalAuth } = require('../middleware/auth');

// Route pubbliche
router.get('/', optionalAuth, getAllQuizzes);
router.get('/:id', optionalAuth, getQuizById);

// Route protette (richiedono login)
router.get('/my/quizzes', protect, getMyQuizzes);

// Route admin (richiedono login + ruolo admin)
router.post('/', protect, createQuiz);
router.post('/:id/questions', protect, addQuestion);
router.put('/:id', protect, updateQuiz);
router.delete('/:id', protect, deleteQuiz);

module.exports = router;