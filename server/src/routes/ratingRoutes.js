const express = require('express');
const router = express.Router();
const { rateNote, getRatings } = require('../controllers/ratingController');
const { protect, optionalAuth } = require('../middleware/auth');

router.post('/:noteId/ratings', protect, rateNote);
router.get('/:noteId/ratings', optionalAuth, getRatings);

module.exports = router;
