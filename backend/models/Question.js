const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  
  questionText: {
    type: String,
    required: [true, 'Il testo della domanda è obbligatorio'],
    trim: true,
    minlength: [5, 'La domanda deve avere almeno 5 caratteri'],
    maxlength: [500, 'La domanda non può superare 500 caratteri']
  },
  
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function(options) {
        return options.length >= 2 && options.length <= 4;
      },
      message: 'Deve avere tra 2 e 4 opzioni di risposta'
    }
  },
  
  correctAnswer: {
    type: Number,
    required: true,
    validate: {
      validator: function(value) {
        return value >= 0 && value < this.options.length;
      },
      message: 'Indice risposta corretta non valido'
    }
  },
  
  points: {
    type: Number,
    default: 10,
    min: [1, 'I punti devono essere almeno 1'],
    max: [100, 'I punti non possono superare 100']
  },
  
  timeLimit: {
    type: Number,
    default: 30,
    min: [5, 'Il tempo limite deve essere almeno 5 secondi'],
    max: [120, 'Il tempo limite non può superare 120 secondi']
  },
  
  explanation: {
    type: String,
    trim: true,
    maxlength: [300, 'La spiegazione non può superare 300 caratteri']
  },
  
  order: {
    type: Number,
    default: 0
  }
  
}, {
  timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);