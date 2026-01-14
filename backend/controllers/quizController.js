const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

// @desc    Ottieni tutti i quiz
// @route   GET /api/quizzes
// @access  Public
exports.getAllQuizzes = async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;

    // Costruisci filtro base
    let filter = {};
    
    // ADMIN vede TUTTI i quiz (pubblici + privati di tutti)
    // USER vede quiz pubblici + i suoi privati
    // GUEST vede solo quiz pubblici
    if (req.user) {
      console.log('🔍 getAllQuizzes - req.user:', {
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      roleType: typeof req.user.role
      });
      
      if (req.user.role === 'admin') {
        // Admin: nessun filtro su isPublic (vede tutto)
        filter = {};
        console.log('👑 Admin loggato - Mostra TUTTI i quiz');
      } else {
        // User normale: pubblici + i suoi privati
        filter.$or = [
          { isPublic: true },
          { createdBy: req.user._id }
        ];
        console.log('👤 User loggato - Mostra pubblici + i suoi privati');
      }
    } else {
      // Guest: solo pubblici
      filter.isPublic = true;
      console.log('👻 Guest - Solo quiz pubblici');
    }

    // Aggiungi altri filtri
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      const searchFilter = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
      
      // Combina con filtro esistente
      if (filter.$or) {
        filter = {
          $and: [
            { $or: filter.$or },
            { $or: searchFilter.$or }
          ]
        };
        if (category) filter.category = category;
        if (difficulty) filter.difficulty = difficulty;
      } else {
        filter = { ...filter, ...searchFilter };
      }
    }

    const quizzes = await Quiz.find(filter)
      .populate('createdBy', 'username')
      .populate('questions')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      quizzes,
      count: quizzes.length
    });

  } catch (error) {
    console.error('Errore nel recupero quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero dei quiz',
      error: error.message
    });
  }
};

// @desc    Ottieni un quiz specifico
// @route   GET /api/quizzes/:id
// @access  Public
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate('questions');
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz non trovato'
      });
    }
    
    res.json({
      success: true,
      quiz
    });
    
  } catch (error) {
    console.error('Errore getQuizById:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero del quiz',
      error: error.message
    });
  }
};

// @desc    Crea un nuovo quiz
// @route   POST /api/quizzes
// @access  Private (Admin)
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, category, difficulty, isPublic } = req.body;
    
    // Validazione
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Titolo, descrizione e categoria sono obbligatori'
      });
    }
    
    // Crea quiz
    const quiz = await Quiz.create({
      title,
      description,
      category,
      difficulty: difficulty || 'medio',
      isPublic: isPublic !== undefined ? isPublic : true,
      createdBy: req.user._id
    });
    
    res.status(201).json({
      success: true,
      message: 'Quiz creato con successo!',
      quiz
    });
    
  } catch (error) {
    console.error('Errore createQuiz:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nella creazione del quiz',
      error: error.message
    });
  }
};

// @desc    Aggiungi domanda a un quiz
// @route   POST /api/quizzes/:id/questions
// @access  Private (Admin)
exports.addQuestion = async (req, res) => {
  try {
    const { questionText, options, correctAnswer, points, timeLimit, explanation } = req.body;
    
    // Validazione
    if (!questionText || !options || correctAnswer === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Testo domanda, opzioni e risposta corretta sono obbligatori'
      });
    }
    
    // Verifica che il quiz esista
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz non trovato'
      });
    }
    
    // Verifica che l'utente sia il creatore
    if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorizzato a modificare questo quiz'
      });
    }
    
    // Crea domanda
    const question = await Question.create({
      quizId: req.params.id,
      questionText,
      options,
      correctAnswer,
      points: points || 10,
      timeLimit: timeLimit || 30,
      explanation,
      order: quiz.questions.length
    });
    
    // Aggiungi domanda al quiz
    quiz.questions.push(question._id);
    await quiz.save();
    
    res.status(201).json({
      success: true,
      message: 'Domanda aggiunta con successo!',
      question
    });
    
  } catch (error) {
    console.error('Errore addQuestion:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nell\'aggiunta della domanda',
      error: error.message
    });
  }
};

// @desc    Aggiorna un quiz
// @route   PUT /api/quizzes/:id
// @access  Private (Admin)
exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz non trovato'
      });
    }
    
    // Verifica autorizzazione
    if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorizzato a modificare questo quiz'
      });
    }
    
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Quiz aggiornato con successo!',
      quiz: updatedQuiz
    });
    
  } catch (error) {
    console.error('Errore updateQuiz:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nell\'aggiornamento del quiz',
      error: error.message
    });
  }
};

// @desc    Elimina un quiz
// @route   DELETE /api/quizzes/:id
// @access  Private (Admin)
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz non trovato'
      });
    }
    
    // Verifica autorizzazione
    if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorizzato a eliminare questo quiz'
      });
    }
    
    // Elimina tutte le domande associate
    await Question.deleteMany({ quizId: req.params.id });
    
    // Elimina quiz
    await quiz.deleteOne();
    
    res.json({
      success: true,
      message: 'Quiz eliminato con successo!'
    });
    
  } catch (error) {
    console.error('Errore deleteQuiz:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nell\'eliminazione del quiz',
      error: error.message
    });
  }
};

// @desc    Ottieni le mie creazioni (quiz creati dall'utente)
// @route   GET /api/quizzes/my-quizzes
// @access  Private
exports.getMyQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user._id })
      .populate('questions')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: quizzes.length,
      quizzes
    });
    
  } catch (error) {
    console.error('Errore getMyQuizzes:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero dei tuoi quiz',
      error: error.message
    });
  }
};

// ==========================================
// ROUTE ADMIN
// ==========================================

// Admin elimina qualsiasi quiz
exports.adminDeleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ 
        success: false, 
        message: 'Quiz non trovato' 
      });
    }
    
    res.json({ 
      success: true, 
      message: `Quiz "${quiz.title}" eliminato dall'amministratore`,
      deletedQuiz: {
        id: quiz._id,
        title: quiz.title,
        createdBy: quiz.createdBy
      }
    });
  } catch (error) {
    console.error('Errore eliminazione quiz admin:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Errore nell\'eliminazione del quiz',
      error: error.message 
    });
  }
};

// Admin visualizza tutti i quiz (pubblici + privati di tutti)
exports.adminGetAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate('createdBy', 'username email role')
      .populate('questions')
      .sort({ createdAt: -1 });
    
    const stats = {
      total: quizzes.length,
      public: quizzes.filter(q => q.isPublic).length,
      private: quizzes.filter(q => !q.isPublic).length
    };
    
    res.json({
      success: true,
      quizzes,
      stats,
      count: quizzes.length
    });
  } catch (error) {
    console.error('Errore recupero quiz admin:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Errore nel recupero dei quiz',
      error: error.message 
    });
  }
};

// Admin ottiene statistiche avanzate
exports.adminGetStats = async (req, res) => {
  try {
    const User = require('../models/User');
    const Result = require('../models/Result');
    
    const totalQuizzes = await Quiz.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalResults = await Result.countDocuments();
    const publicQuizzes = await Quiz.countDocuments({ isPublic: true });
    const privateQuizzes = await Quiz.countDocuments({ isPublic: false });
    
    // Quiz più giocati
    const mostPlayed = await Quiz.find()
      .sort({ totalPlays: -1 })
      .limit(5)
      .select('title totalPlays createdBy')
      .populate('createdBy', 'username');
    
    res.json({
      success: true,
      stats: {
        quizzes: {
          total: totalQuizzes,
          public: publicQuizzes,
          private: privateQuizzes
        },
        users: totalUsers,
        totalGamesPlayed: totalResults,
        mostPlayedQuizzes: mostPlayed
      }
    });
  } catch (error) {
    console.error('Errore statistiche admin:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Errore nel recupero delle statistiche',
      error: error.message 
    });
  };
};