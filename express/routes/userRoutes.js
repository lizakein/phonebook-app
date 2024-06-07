const express = require('express');
const { updateUserInfo, getUserById, updateEmail, updatePassword, getAllUsers } = require('../controllers/userController');
const upload = require('../config/uploadConfig');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/user-info', authenticateToken, upload.single('photo'), updateUserInfo);
router.get('/:id', authenticateToken, getUserById);
router.post('/update-email', authenticateToken, updateEmail);
router.post('/update-password', authenticateToken, updatePassword);
router.get('/', authenticateToken, getAllUsers);

module.exports = router;
