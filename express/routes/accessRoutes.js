const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { createAccessRequest, getAccessRequestsByUserId, updateAccessRequestStatus, checkAccessRequest, checkAccessRequestStatus, getAllAccessRequests } = require('../controllers/accessController');

const router = express.Router();

router.post('/access-request', authenticateToken, createAccessRequest);
router.get('/access-requests/:userId', authenticateToken, getAccessRequestsByUserId);
router.put('/access-request/:requestId', authenticateToken, updateAccessRequestStatus);
router.get('/access-request/check/:requesterId/:ownerId', authenticateToken, checkAccessRequest);
router.get('/access-request/status/:requesterId/:ownerId', authenticateToken, checkAccessRequestStatus);
router.get('/access-requests', authenticateToken, getAllAccessRequests);

module.exports = router;
