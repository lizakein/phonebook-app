const express = require('express');
const { 
    updateUserInfo, 
    getUserById, 
    updateEmail, 
    updatePassword, 
    getAllUsers, 
    updateUserBlockStatus, 
    getUsersByBlockStatus 
} = require('../controllers/userController');
const upload = require('../config/uploadConfig');
const { authenticateToken } = require('../middleware/authMiddleware');
const { checkAdminRole } = require('../middleware/adminMiddleware');

const router = express.Router();

router.put('/user-info', authenticateToken, upload.single('photo'), updateUserInfo);
router.get('/block-list', authenticateToken, getUsersByBlockStatus);
router.get('/:id', authenticateToken, getUserById);
router.put('/update-email/:id', authenticateToken, updateEmail);
router.put('/update-password/:id', authenticateToken, updatePassword);
router.get('/', authenticateToken, getAllUsers);
router.put('/block-user/:id', authenticateToken, checkAdminRole, updateUserBlockStatus);

module.exports = router;
