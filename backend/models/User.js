const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username è obbligatorio'],
    unique: true,
    trim: true,
    minlength: [3, 'Username deve avere almeno 3 caratteri']
  },
  email: {
    type: String,
    required: [true, 'Email è obbligatoria'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Email non valida']
  },
  password: {
    type: String,
    required: [true, 'Password è obbligatoria'],
    minlength: [6, 'Password deve avere almeno 6 caratteri']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Hash password prima del salvataggio
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Metodo per confrontare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);