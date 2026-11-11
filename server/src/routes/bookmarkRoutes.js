const express = require('express');
const router = express.Router();
const { toggleBookmark, getBookmarks, checkBookmark } = require('../controllers/bookmarkController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getBookmarks);
router.post('/:noteId', protect, toggleBookmark);
router.get('/:noteId/check', protect, checkBookmark);

module.exports = router;
