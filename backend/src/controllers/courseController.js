const Course = require('../models/Course');
const User = require('../models/User');
const UserGroup = require('../models/UserGroup');
const cache = require('../cache/cacheHelpers');
const { coursesListKey } = require('../helpers/cacheKeys');
const { publishNotification } = require('../services/kafkaService');

// Helper for user group cache key
function userGroupsCacheKey() {
  return 'user-groups:all';
}

// Get user groups (with cache)
exports.getUserGroups = async (req, res) => {
  try {
    const key = userGroupsCacheKey();
    const cached = await cache.get(key);
    if (cached) return res.json(cached);
    const groups = await UserGroup.find();
    await cache.set(key, groups, 3600); // cache for 1 hour
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Invalidate user group cache after create/update/delete
exports.invalidateUserGroupsCache = async () => {
  const cache = require('../cache/cacheHelpers');
  await cache.del(userGroupsCacheKey());
};

// GET /api/courses - List courses with filtering, search, and role-based visibility
exports.listCourses = async (req, res) => {
  try {
    const { category, search } = req.query;
    const user = req.user;
    const cacheKey = coursesListKey(user) + (category ? `:cat:${category}` : '') + (search ? `:search:${search}` : '');

    // Try cache first
    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    let filter = {};
    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (user.role === 'learner') {
      filter.isPublished = true;
      filter.$or = [
        { targetGroups: { $size: 0 } },
        { targetGroups: user.userGroup },
        { targetGroups: { $exists: false } }
      ];
    } else if (user.role === 'instructor') {
      filter.$or = [
        { instructorId: user.userId },
        { isPublished: true }
      ];
    }
    const courses = await Course.find(filter).populate('instructorId', 'name email');
    await cache.set(cacheKey, courses, 600); // cache for 10 min
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/courses - Instructor creates a new course (step 1)
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, targetGroups, badgeId, isPublished } = req.body;
    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category are required' });
    }
    const course = new Course({
      title,
      description,
      category,
      instructorId: req.user.userId,
      targetGroups: Array.isArray(targetGroups) ? targetGroups : [],
      badgeId: badgeId || undefined,
      isPublished: !!isPublished,
      createdAt: new Date()
    });
    await course.save();
    await course.populate('instructorId', 'name email');
    // Invalidate all course list caches
    const redisClient = require('../cache/redisClient');
    const keys = await redisClient.keys('courses:list*');
    if (keys.length) await redisClient.del(keys);
    // If published, send notification to user groups via Kafka
    if (course.isPublished && course.targetGroups.length > 0) {
      await publishNotification({
        type: 'course_published',
        courseId: course._id,
        title: course.title,
        targetGroups: course.targetGroups,
        instructorId: course.instructorId._id,
        createdAt: course.createdAt
      });
    }
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/courses/:id - Get course details
exports.getCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const cacheKey = `course:details:${courseId}`;
    const cached = await cache.get(cacheKey);
    if (cached) return res.json(cached);
    const course = await Course.findById(courseId).populate('instructorId', 'name email');
    if (!course) return res.status(404).json({ error: 'Course not found' });
    await cache.set(cacheKey, course, 600); // cache for 10 min
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /api/courses/:id - Invalidate course list cache on update
exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const instructorId = req.user.userId;
    const updateFields = (({ title, description, category, targetGroups, badgeId, isPublished }) => ({ title, description, category, targetGroups, badgeId, isPublished }))(req.body);
    // Remove undefined fields
    Object.keys(updateFields).forEach(key => updateFields[key] === undefined && delete updateFields[key]);

    // Find course
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (!course.instructorId.equals(instructorId)) {
      return res.status(403).json({ error: 'Not authorized to edit this course' });
    }
    const wasPublished = course.isPublished;
    // Update fields
    Object.assign(course, updateFields);
    await course.save();
    await course.populate('instructorId', 'name email');
    // Invalidate all course list caches
    const redisClient = require('../cache/redisClient');
    const keys = await redisClient.keys('courses:list*');
    if (keys.length) await redisClient.del(keys);
    // Invalidate course details cache
    await redisClient.del(`course:details:${courseId}`);
    // If course is now published and was not before, send Kafka notification
    if (!wasPublished && course.isPublished && course.targetGroups.length > 0) {
      const { publishNotification } = require('../services/kafkaService');
      await publishNotification({
        type: 'course_published',
        courseId: course._id,
        title: course.title,
        targetGroups: course.targetGroups,
        instructorId: course.instructorId._id,
        createdAt: course.createdAt
      });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const instructorId = req.user.userId;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (!course.instructorId.equals(instructorId)) {
      return res.status(403).json({ error: 'Not authorized to delete this course' });
    }
    const wasPublished = course.isPublished;
    const targetGroups = course.targetGroups;
    await course.deleteOne();
    // Invalidate all course list caches
    const redisClient = require('../cache/redisClient');
    const keys = await redisClient.keys('courses:list*');
    if (keys.length) await redisClient.del(keys);
    // Invalidate course details cache
    await redisClient.del(`course:details:${courseId}`);
    // Optionally, send Kafka notification if course was published
    if (wasPublished && targetGroups.length > 0) {
      const { publishNotification } = require('../services/kafkaService');
      await publishNotification({
        type: 'course_deleted',
        courseId,
        targetGroups,
        instructorId,
        deletedAt: new Date()
      });
    }
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.setCourseVisibility = async (req, res) => {
  try {
    const courseId = req.params.id;
    const instructorId = req.user.userId;
    const { targetGroups } = req.body;
    if (!Array.isArray(targetGroups)) {
      return res.status(400).json({ error: 'targetGroups must be an array' });
    }
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (!course.instructorId.equals(instructorId)) {
      return res.status(403).json({ error: 'Not authorized to set visibility for this course' });
    }
    course.targetGroups = targetGroups;
    await course.save();
    // Invalidate all course list caches
    const redisClient = require('../cache/redisClient');
    const keys = await redisClient.keys('courses:list*');
    if (keys.length) await redisClient.del(keys);
    // Invalidate course details cache
    await redisClient.del(`course:details:${courseId}`);
    // Optionally, send Kafka notification if course is published
    if (course.isPublished && course.targetGroups.length > 0) {
      const { publishNotification } = require('../services/kafkaService');
      await publishNotification({
        type: 'course_visibility_updated',
        courseId: course._id,
        title: course.title,
        targetGroups: course.targetGroups,
        instructorId,
        updatedAt: new Date()
      });
    }
    res.json({ message: 'Course visibility updated', targetGroups });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.assignBadgeToCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const instructorId = req.user.userId;
    const { badgeId } = req.body;
    if (!badgeId) {
      return res.status(400).json({ error: 'badgeId is required' });
    }
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (!course.instructorId.equals(instructorId)) {
      return res.status(403).json({ error: 'Not authorized to assign badge to this course' });
    }
    course.badgeId = badgeId;
    await course.save();
    // Invalidate all course list caches
    const redisClient = require('../cache/redisClient');
    const keys = await redisClient.keys('courses:list*');
    if (keys.length) await redisClient.del(keys);
    // Invalidate course details cache
    await redisClient.del(`course:details:${courseId}`);
    // Optionally, send Kafka notification if course is published
    if (course.isPublished && course.targetGroups.length > 0) {
      const { publishNotification } = require('../services/kafkaService');
      await publishNotification({
        type: 'course_badge_assigned',
        courseId: course._id,
        badgeId,
        title: course.title,
        targetGroups: course.targetGroups,
        instructorId,
        updatedAt: new Date()
      });
    }
    res.json({ message: 'Badge assigned to course', badgeId });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}; 