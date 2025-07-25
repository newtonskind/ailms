const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const cache = require('../cache/cacheHelpers');

function myRequestsKey(userId) {
  return `enrollments:my-requests:${userId}`;
}

exports.requestEnrollment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ error: 'courseId is required' });
    }
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    // Prevent duplicate requests
    const existing = await Enrollment.findOne({ userId, courseId });
    if (existing) {
      return res.status(409).json({ error: 'Enrollment request already exists' });
    }
    // Create enrollment request
    const enrollment = new Enrollment({
      userId,
      courseId,
      status: 'pending',
      requestedAt: new Date()
    });
    await enrollment.save();
    // Invalidate my-requests cache
    await cache.del(myRequestsKey(userId));
    // TODO: Notify instructor (Kafka/Notification system)
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.myRequests = async (req, res) => {
  try {
    const userId = req.user.userId;
    const key = myRequestsKey(userId);
    const cached = await cache.get(key);
    if (cached) return res.json(cached);
    const enrollments = await Enrollment.find({ userId })
      .populate('courseId', 'title category instructorId')
      .sort({ requestedAt: -1 });
    await cache.set(key, enrollments, 600); // cache for 10 min
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.approveEnrollment = async (req, res) => {
  try {
    const instructorId = req.user.userId;
    const enrollmentId = req.params.id;
    const { action } = req.body; // 'approve' or 'deny'
    if (!['approve', 'deny'].includes(action)) {
      return res.status(400).json({ error: 'Action must be approve or deny' });
    }
    // Find enrollment
    const enrollment = await Enrollment.findById(enrollmentId).populate('courseId');
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment request not found' });
    }
    // Only the course instructor can approve/deny
    if (!enrollment.courseId.instructorId.equals(instructorId)) {
      return res.status(403).json({ error: 'Not authorized to process this enrollment' });
    }
    if (enrollment.status !== 'pending') {
      return res.status(409).json({ error: 'Enrollment already processed' });
    }
    enrollment.status = action === 'approve' ? 'approved' : 'denied';
    enrollment.processedAt = new Date();
    enrollment.processedBy = instructorId;
    await enrollment.save();
    // Invalidate my-requests cache for the learner
    await cache.del(myRequestsKey(enrollment.userId));
    // TODO: Notify learner (Kafka/Notification system)
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.listPendingEnrollments = async (req, res) => {
  try {
    const instructorId = req.user.userId;
    // Find all courses taught by this instructor
    const courses = await Course.find({ instructorId }).select('_id');
    const courseIds = courses.map(c => c._id);
    // Find all pending enrollments for these courses
    const enrollments = await Enrollment.find({ courseId: { $in: courseIds }, status: 'pending' })
      .populate('courseId', 'title category')
      .populate('userId', 'name email department userGroup');
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}; 