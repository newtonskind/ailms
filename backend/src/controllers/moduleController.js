const Module = require('../models/Module');
const Course = require('../models/Course');

exports.addModule = async (req, res) => {
  try {
    const courseId = req.params.id;
    const instructorId = req.user.userId;
    const { title, order } = req.body;
    if (!title || order === undefined) {
      return res.status(400).json({ error: 'Title and order are required' });
    }
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (!course.instructorId.equals(instructorId)) {
      return res.status(403).json({ error: 'Not authorized to add module to this course' });
    }
    const module = new Module({
      courseId,
      title,
      order,
      createdAt: new Date()
    });
    await module.save();
    // Invalidate course modules cache
    const redisClient = require('../cache/redisClient');
    await redisClient.del(`course:modules:${courseId}`);
    // Optionally, send Kafka notification if course is published
    if (course.isPublished && course.targetGroups.length > 0) {
      const { publishNotification } = require('../services/kafkaService');
      await publishNotification({
        type: 'module_added',
        courseId,
        moduleId: module._id,
        title: module.title,
        targetGroups: course.targetGroups,
        instructorId,
        createdAt: module.createdAt
      });
    }
    res.status(201).json(module);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.editModule = async (req, res) => {
  try {
    const moduleId = req.params.id;
    const instructorId = req.user.userId;
    const { title, order } = req.body;
    // Find module
    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ error: 'Module not found' });
    // Find parent course
    const course = await Course.findById(module.courseId);
    if (!course) return res.status(404).json({ error: 'Parent course not found' });
    if (!course.instructorId.equals(instructorId)) {
      return res.status(403).json({ error: 'Not authorized to edit this module' });
    }
    if (title !== undefined) module.title = title;
    if (order !== undefined) module.order = order;
    await module.save();
    // Invalidate course modules cache
    const redisClient = require('../cache/redisClient');
    await redisClient.del(`course:modules:${course._id}`);
    // Optionally, send Kafka notification if course is published
    if (course.isPublished && course.targetGroups.length > 0) {
      const { publishNotification } = require('../services/kafkaService');
      await publishNotification({
        type: 'module_edited',
        courseId: course._id,
        moduleId: module._id,
        title: module.title,
        targetGroups: course.targetGroups,
        instructorId,
        updatedAt: new Date()
      });
    }
    res.json(module);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteModule = async (req, res) => {
  try {
    const moduleId = req.params.id;
    const instructorId = req.user.userId;
    // Find module
    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ error: 'Module not found' });
    // Find parent course
    const course = await Course.findById(module.courseId);
    if (!course) return res.status(404).json({ error: 'Parent course not found' });
    if (!course.instructorId.equals(instructorId)) {
      return res.status(403).json({ error: 'Not authorized to delete this module' });
    }
    await module.deleteOne();
    // Invalidate course modules cache
    const redisClient = require('../cache/redisClient');
    await redisClient.del(`course:modules:${course._id}`);
    // Optionally, send Kafka notification if course is published
    if (course.isPublished && course.targetGroups.length > 0) {
      const { publishNotification } = require('../services/kafkaService');
      await publishNotification({
        type: 'module_deleted',
        courseId: course._id,
        moduleId: module._id,
        title: module.title,
        targetGroups: course.targetGroups,
        instructorId,
        deletedAt: new Date()
      });
    }
    res.json({ message: 'Module deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}; 