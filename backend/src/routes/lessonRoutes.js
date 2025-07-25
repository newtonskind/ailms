const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// ... other lesson routes ...

// Upload video/pdf to Google Drive and update lesson
router.post('/:id/upload', auth, role('instructor'), upload.single('file'), lessonController.uploadLessonContent);

module.exports = router; 