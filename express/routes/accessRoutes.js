const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { createAccessRequest, getAccessRequestsByUserId, updateAccessRequestStatus, checkAccessRequest } = require('../controllers/accessController');

const router = express.Router();

router.post('/access-request', authenticateToken, createAccessRequest);
router.get('/access-requests/:userId', authenticateToken, getAccessRequestsByUserId);
router.post('/access-request/update', authenticateToken, updateAccessRequestStatus);
router.get('/access-request/check/:requesterId/:ownerId', authenticateToken, checkAccessRequest);

module.exports = router;
