const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // bcrypt hashed
  name: { type: String, required: true },
  role: { type: String, enum: ['learner', 'instructor', 'admin'], required: true },
  department: { type: String },
  userGroup: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema); 