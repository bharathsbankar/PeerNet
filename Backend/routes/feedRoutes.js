const express = require('express');
const router = express.Router();
const { getFeeds, createFeed } = require('../controllers/feedController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getFeeds);
router.post('/', protect, createFeed);

module.exports = router;
