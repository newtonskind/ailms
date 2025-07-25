const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String], // array of 4 options
  correctAnswer: Number // index of correct option (0-3)
}, { _id: false });

const lessonSchema = new mongoose.Schema({
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }, // denormalized
  title: { type: String, required: true },
  contentType: { type: String, enum: ['video', 'pdf'], required: true },
  contentUrl: { type: String, required: true },
  order: { type: Number, required: true },
  hasQuiz: { type: Boolean, default: false },
  quiz: {
    questions: [questionSchema]
  }
});

module.exports = mongoose.model('Lesson', lessonSchema); 