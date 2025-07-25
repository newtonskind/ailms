const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recommendedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  generatedAt: { type: Date, default: Date.now },
  validUntil: { type: Date }
});

module.exports = mongoose.model('Recommendation', recommendationSchema); 