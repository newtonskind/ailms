const express = require('express');
const router = express.Router();
const userGroupController = require('../controllers/userGroupController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Create
router.post('/', auth, role('admin'), userGroupController.createUserGroup);
// List (admin or instructor)
router.get('/', auth, role(['admin', 'instructor']), userGroupController.listUserGroups);
// Update
router.put('/:id', auth, role('admin'), userGroupController.updateUserGroup);
// Delete
router.delete('/:id', auth, role('admin'), userGroupController.deleteUserGroup);

module.exports = router; 