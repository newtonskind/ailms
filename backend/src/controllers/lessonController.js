const Lesson = require('../models/Lesson');
const Module = require('../models/Module');
const Course = require('../models/Course');
const fs = require('fs');
const path = require('path');
const googleDriveService = require('../services/googleDriveService');

exports.addLesson = async (req, res) => {
  try {
    const moduleId = req.params.id;
    const instructorId = req.user.userId;
    const { title, contentType, contentUrl, order, hasQuiz, quiz } = req.body;
    if (!title || !contentType || !contentUrl || order === undefined) {
      return res.status(400).json({ error: 'Title, contentType, contentUrl, and order are required' });
    }
    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ error: 'Module not found' });
    const course = await Course.findById(module.courseId);
    if (!course) return res.status(404).json({ error: 'Parent course not found' });
    if (!course.instructorId.equals(instructorId)) {
      return res.status(403).json({ error: 'Not authorized to add lesson to this module' });
    }
    const lesson = new Lesson({
      moduleId,
      courseId: course._id,
      title,
      contentType,
      contentUrl,
      order,
      hasQuiz: !!hasQuiz,
      quiz: hasQuiz ? quiz : undefined
    });
    await lesson.save();
    // Invalidate module lessons cache
    const redisClient = require('../cache/redisClient');
    await redisClient.del(`module:lessons:${moduleId}`);
    // Optionally, send Kafka notification if course is published
    if (course.isPublished && course.targetGroups.length > 0) {
      const { publishNotification } = require('../services/kafkaService');
      await publishNotification({
        type: 'lesson_added',
        courseId: course._id,
        moduleId,
        lessonId: lesson._id,
        title: lesson.title,
        targetGroups: course.targetGroups,
        instructorId,
        createdAt: lesson.createdAt
      });
    }
    res.status(201).json(lesson);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.editLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const instructorId = req.user.userId;
    const { title, contentType, contentUrl, order, hasQuiz, quiz } = req.body;
    // Find lesson
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    // Find parent module and course
    const module = await Module.findById(lesson.moduleId);
    if (!module) return res.status(404).json({ error: 'Parent module not found' });
    const course = await Course.findById(lesson.courseId);
    if (!course) return res.status(404).json({ error: 'Parent course not found' });
    if (!course.instructorId.equals(instructorId)) {
      return res.status(403).json({ error: 'Not authorized to edit this lesson' });
    }
    if (title !== undefined) lesson.title = title;
    if (contentType !== undefined) lesson.contentType = contentType;
    if (contentUrl !== undefined) lesson.contentUrl = contentUrl;
    if (order !== undefined) lesson.order = order;
    if (hasQuiz !== undefined) lesson.hasQuiz = !!hasQuiz;
    if (hasQuiz && quiz !== undefined) lesson.quiz = quiz;
    await lesson.save();
    // Invalidate module lessons cache
    const redisClient = require('../cache/redisClient');
    await redisClient.del(`module:lessons:${module._id}`);
    // Optionally, send Kafka notification if course is published
    if (course.isPublished && course.targetGroups.length > 0) {
      const { publishNotification } = require('../services/kafkaService');
      await publishNotification({
        type: 'lesson_edited',
        courseId: course._id,
        moduleId: module._id,
        lessonId: lesson._id,
        title: lesson.title,
        targetGroups: course.targetGroups,
        instructorId,
        updatedAt: new Date()
      });
    }
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.uploadLessonContent = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const instructorId = req.user.userId;
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });
    // Find lesson, module, course
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    const module = await Module.findById(lesson.moduleId);
    if (!module) return res.status(404).json({ error: 'Parent module not found' });
    const course = await Course.findById(lesson.courseId);
    if (!course) return res.status(404).json({ error: 'Parent course not found' });
    if (!course.instructorId.equals(instructorId)) {
      return res.status(403).json({ error: 'Not authorized to upload content for this lesson' });
    }
    // Upload file to Google Drive
    const ext = path.extname(file.originalname).toLowerCase();
    const contentType = ext === '.pdf' ? 'pdf' : 'video';
    const gcsFileName = `${course._id}_${module._id}_${lesson._id}_${Date.now()}${ext}`;
    const fileId = await googleDriveService.uploadFile(file.path, gcsFileName);
    const fileUrl = `https://drive.google.com/uc?id=${fileId}`;
    // Update lesson
    lesson.contentType = contentType;
    lesson.contentUrl = fileUrl;
    await lesson.save();
    // Clean up local file
    fs.unlinkSync(file.path);
    // Invalidate module lessons cache
    const redisClient = require('../cache/redisClient');
    await redisClient.del(`module:lessons:${module._id}`);
    // Optionally, send Kafka notification if course is published
    if (course.isPublished && course.targetGroups.length > 0) {
      const { publishNotification } = require('../services/kafkaService');
      await publishNotification({
        type: 'lesson_content_uploaded',
        courseId: course._id,
        moduleId: module._id,
        lessonId: lesson._id,
        title: lesson.title,
        targetGroups: course.targetGroups,
        instructorId,
        uploadedAt: new Date()
      });
    }
    res.json({ message: 'File uploaded and lesson updated', contentUrl: fileUrl });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.saveLessonQuiz = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const instructorId = req.user.userId;
    const { quiz } = req.body;
    if (!quiz || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
      return res.status(400).json({ error: 'Quiz with questions is required' });
    }
    // Find lesson, module, course
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    const module = await Module.findById(lesson.moduleId);
    if (!module) return res.status(404).json({ error: 'Parent module not found' });
    const course = await Course.findById(lesson.courseId);
    if (!course) return res.status(404).json({ error: 'Parent course not found' });
    if (!course.instructorId.equals(instructorId)) {
      return res.status(403).json({ error: 'Not authorized to save quiz for this lesson' });
    }
    lesson.hasQuiz = true;
    lesson.quiz = quiz;
    await lesson.save();
    // Invalidate module lessons cache
    const redisClient = require('../cache/redisClient');
    await redisClient.del(`module:lessons:${module._id}`);
    // Optionally, send Kafka notification if course is published
    if (course.isPublished && course.targetGroups.length > 0) {
      const { publishNotification } = require('../services/kafkaService');
      await publishNotification({
        type: 'lesson_quiz_saved',
        courseId: course._id,
        moduleId: module._id,
        lessonId: lesson._id,
        title: lesson.title,
        targetGroups: course.targetGroups,
        instructorId,
        updatedAt: new Date()
      });
    }
    res.json({ message: 'Quiz saved and approved for lesson', quiz });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}; 