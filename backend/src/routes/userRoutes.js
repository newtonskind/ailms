const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const badgeController = require('../controllers/badgeController');
const recommendationController = require('../controllers/recommendationController');

router.get('/profile', auth, userController.getProfile);
router.get('/badges', auth, badgeController.listBadges);
router.get('/recommendations', auth, recommendationController.getSessionRecommendations);

module.exports = router; 