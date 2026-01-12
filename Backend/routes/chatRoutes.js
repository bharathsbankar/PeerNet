const express = require('express');
const router = express.Router();
const { getChats, accessChat, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getChats); // Get all chats
router.post('/', protect, accessChat); // Create or fetch 1-on-1 chat
router.post('/message', protect, sendMessage); // Send text

module.exports = router;
