const express = require('express');
const router = express.Router();
const {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  addQuestion,
  deleteQuiz,
  getMyQuizzes,
  adminGetAllQuizzes,
  adminDeleteQuiz
} = require('../controllers/quizController');
const { protect, optionalAuth, adminOnly } = require('../middleware/auth');

// Route pubbliche
router.get('/', optionalAuth, getAllQuizzes);
router.get('/:id', optionalAuth, getQuizById);

// Route protette (richiedono login)
router.get('/my/quizzes', protect, getMyQuizzes);

// Route admin (richiedono login + ruolo admin)
router.post('/', protect, createQuiz);
router.post('/:id/questions', protect, addQuestion);
router.delete('/:id', protect, deleteQuiz);


// ROUTE ADMIN
router.get('/admin/all', protect, adminOnly, adminGetAllQuizzes);
router.delete('/admin/:id', protect, adminOnly, adminDeleteQuiz);

module.exports = router;