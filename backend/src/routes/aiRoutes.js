const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Generate quiz from uploaded PDF (calls AI)
router.post('/generate-quiz', auth, role('instructor'), upload.single('file'), aiController.generateQuizFromPdf);

module.exports = router; 