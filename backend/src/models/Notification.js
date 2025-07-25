const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // recipient
  type: { type: String, required: true }, // 'enrollment_request', 'enrollment_approved', 'enrollment_denied'
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  relatedCourseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  relatedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Notification', notificationSchema); 