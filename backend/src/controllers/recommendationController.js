const cache = require('../cache/cacheHelpers');
const Recommendation = require('../models/Recommendation');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const redisClient = require('../cache/redisClient');
const axios = require('axios');

function recommendationsKey(userId) {
  return `recommendations:${userId}`;
}

function recommendationsSessionKey(userId) {
  return `recommendations:session:${userId}`;
}

exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.params.userId;
    const key = recommendationsKey(userId);
    const cached = await cache.get(key);
    if (cached) return res.json(cached);
    // For now, fetch from DB (AI logic can be added later)
    const rec = await Recommendation.findOne({ userId });
    if (!rec) return res.status(404).json({ error: 'No recommendations found' });
    await cache.set(key, rec, 600); // cache for 10 min
    res.json(rec);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getSessionRecommendations = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cacheKey = recommendationsSessionKey(userId);
    // Check Redis session cache first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    // Fetch enrolled courses for user
    const enrollments = await Enrollment.find({ userId, status: 'approved' }).populate('courseId');
    const learnerCourses = enrollments.map(e => {
      const c = e.courseId;
      return c ? {
        course_id: c._id.toString(),
        title: c.title,
        description: c.description || '',
        category: (c.category || '').toLowerCase()
      } : null;
    }).filter(Boolean);
    // Fetch full course catalog
    const catalogDocs = await Course.find();
    const catalog = catalogDocs.map(c => ({
      course_id: c._id.toString(),
      title: c.title,
      description: c.description || '',
      category: (c.category || '').toLowerCase()
    }));
    // Prepare body for AI API
    const body = {
      learner: [ { courses: learnerCourses } ],
      catalog
    };
    // Call external AI API
    const aiRes = await axios.post('http://14.194.133.90:5000/recommend', body, {
      headers: { 'Content-Type': 'application/json' }
    });
    const recommendedIds = aiRes.data;
    // Cache in Redis for this session (e.g., 1 hour)
    await redisClient.set(cacheKey, JSON.stringify(recommendedIds), { EX: 3600 });
    res.json(recommendedIds);
  } catch (err) {
    console.error('Recommendation error:', err);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
}; 