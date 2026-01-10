const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Il titolo è obbligatorio'],
    trim: true,
    minlength: [3, 'Il titolo deve avere almeno 3 caratteri'],
    maxlength: [100, 'Il titolo non può superare 100 caratteri']
  },
  
  description: {
    type: String,
    required: [true, 'La descrizione è obbligatoria'],
    trim: true,
    maxlength: [500, 'La descrizione non può superare 500 caratteri']
  },
  
  category: {
    type: String,
    required: [true, 'La categoria è obbligatoria'],
    enum: {
      values: ['Geografia', 'Storia', 'Scienza', 'Sport', 'Cultura Generale', 'Tecnologia', 'Arte', 'Musica'],
      message: 'Categoria non valida'
    }
  },
  
  difficulty: {
    type: String,
    required: true,
    enum: {
      values: ['facile', 'medio', 'difficile'],
      message: 'Difficoltà non valida'
    },
    default: 'medio'
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  
  isPublic: {
    type: Boolean,
    default: true
  },
  
  totalPlays: {
    type: Number,
    default: 0
  },
  
  averageScore: {
    type: Number,
    default: 0
  }
  
}, {
  timestamps: true
});


module.exports = mongoose.model('Quiz', quizSchema);