const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Learner requests enrollment
router.post('/request', auth, role('learner'), enrollmentController.requestEnrollment);
// Learner views their requests
router.get('/my-requests', auth, role('learner'), enrollmentController.myRequests);
// Instructor approves/denies enrollment
router.put('/:id/approve', auth, role('instructor'), enrollmentController.approveEnrollment);

module.exports = router; 