const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String }, // 'Technology', 'Sales', 'HR'
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetGroups: [{ type: String }], // empty means all
  badgeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge' },
  isPublished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema); 