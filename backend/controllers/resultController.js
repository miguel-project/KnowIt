const Result = require('../models/Result');
const Quiz = require('../models/Quiz');

// Salva risultato quiz
// POST /api/results
// Private
exports.saveResult = async (req, res) => {
  try {
    const {
      quizId,
      score,
      maxScore,
      percentage,
      correctAnswers,
      totalQuestions,
      answers
    } = req.body;

    // Verifica che il quiz esista
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz non trovato'
      });
    }

    // Crea il risultato
    const result = await Result.create({
      quiz: quizId,
      user: req.user.id,
      score,
      maxScore,
      percentage,
      correctAnswers,
      totalQuestions,
      answers
    });

    // Incrementa il contatore di partite giocate nel quiz
    quiz.totalPlays = (quiz.totalPlays || 0) + 1;
    await quiz.save();

    // Popola i dati per la risposta
    await result.populate('user', 'username');
    await result.populate('quiz', 'title');

    res.status(201).json({
      success: true,
      result
    });

  } catch (error) {
    console.error('Errore nel salvare il risultato:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nel salvare il risultato',
      error: error.message
    });
  }
};

// Ottieni risultati di un quiz (leaderboard)
// GET /api/results/quiz/:quizId
// Public
exports.getQuizResults = async (req, res) => {
  try {
    const { quizId } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    const results = await Result.find({ quiz: quizId })
      .sort({ score: -1, completedAt: 1 }) // Ordina per punteggio decrescente
      .limit(limit)
      .populate('user', 'username')
      .populate('quiz', 'title category');

    res.json({
      success: true,
      results,
      count: results.length
    });

  } catch (error) {
    console.error('Errore nel recuperare i risultati:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nel recuperare i risultati',
      error: error.message
    });
  }
};

// Ottieni risultati di un utente
// GET /api/results/user/:userId
// Private
exports.getUserResults = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verifica che l'utente possa vedere solo i propri risultati (o sia admin)
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorizzato a vedere questi risultati'
      });
    }

    const results = await Result.find({ user: userId })
      .sort({ completedAt: -1 })
      .populate('quiz', 'title category difficulty');

    // Calcola statistiche
    const stats = {
      totalGames: results.length,
      averageScore: results.length > 0
        ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
        : 0,
      bestScore: results.length > 0
        ? Math.max(...results.map(r => r.score))
        : 0,
      totalCorrectAnswers: results.reduce((sum, r) => sum + r.correctAnswers, 0),
      totalQuestions: results.reduce((sum, r) => sum + r.totalQuestions, 0)
    };

    res.json({
      success: true,
      results,
      stats
    });

  } catch (error) {
    console.error('Errore nel recuperare i risultati utente:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nel recuperare i risultati',
      error: error.message
    });
  }
};

// Ottieni statistiche globali
// GET /api/results/stats/global
// Public
exports.getGlobalStats = async (req, res) => {
  try {
    // Ottieni solo quiz pubblici
    const publicQuizzes = await Quiz.find({ isPublic: true }).select('_id');
    const publicQuizIds = publicQuizzes.map(q => q._id);

    // Conta solo risultati di quiz pubblici
    const totalGames = await Result.countDocuments({
      quiz: { $in: publicQuizIds }
    });

    // Conta giocatori unici che hanno giocato quiz pubblici
    const totalPlayers = await Result.distinct('user', {
      quiz: { $in: publicQuizIds }
    }).then(users => users.length);
    
    // Top 10 punteggi - SOLO quiz pubblici
    const topScores = await Result.find({
      quiz: { $in: publicQuizIds }
    })
      .sort({ score: -1 })
      .limit(10)
      .populate('user', 'username')
      .populate('quiz', 'title category isPublic');

    res.json({
      success: true,
      stats: {
        totalGames,
        totalPlayers,
        topScores,
      }
    });

  } catch (error) {
    console.error('Errore nel recuperare statistiche globali:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nel recuperare statistiche',
      error: error.message
    });
  }
};

// Elimina risultato
// DELETE /api/results/:id
// Private (solo proprietario o admin)
exports.deleteResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Risultato non trovato'
      });
    }

    // Verifica autorizzazione
    if (result.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorizzato a eliminare questo risultato'
      });
    }

    await result.deleteOne();

    res.json({
      success: true,
      message: 'Risultato eliminato'
    });

  } catch (error) {
    console.error('Errore nell\'eliminare il risultato:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nell\'eliminare il risultato',
      error: error.message
    });
  }
};