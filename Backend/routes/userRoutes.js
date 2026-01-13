const express = require('express');
const router = express.Router();
const {
    getRecommendations,
    getConnections,
    getRequests,
    sendRequest,
    acceptRequest,
    rejectRequest
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/recommendations', protect, getRecommendations);
router.get('/connections', protect, getConnections);
router.get('/requests', protect, getRequests);


router.post('/request/:userId', protect, sendRequest);
router.put('/request/:requestId/accept', protect, acceptRequest);
router.put('/request/:requestId/reject', protect, rejectRequest);
router.get('/search/:query', protect, require('../controllers/userController').searchUsers);
router.put('/profile', protect, require('../controllers/userController').updateUserProfile);

module.exports = router;
