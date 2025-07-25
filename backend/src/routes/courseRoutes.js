const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// List courses (all users)
router.get('/', auth, courseController.listCourses);
// Create course (instructor only)
router.post('/', auth, role('instructor'), courseController.createCourse);
// Get course details
router.get('/:id', auth, courseController.getCourse);
// Update course (instructor or admin)
router.put('/:id', auth, role(['instructor', 'admin']), courseController.updateCourse);

module.exports = router; 