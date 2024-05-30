const express = require('express');
const { updateUserInfo } = require('../controllers/userController');
const upload = require('../config/uploadConfig');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/user-info', authenticateToken, upload.single('photo'), updateUserInfo);

module.exports = router;