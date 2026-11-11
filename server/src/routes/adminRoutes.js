const express = require('express');
const router = express.Router();
const { getDashboardStats, getPendingNotes, approveNote, rejectNote, getAllUsers, toggleUserStatus, forceDeleteNote } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/notes/pending', getPendingNotes);
router.put('/notes/:id/approve', approveNote);
router.put('/notes/:id/reject', rejectNote);
router.delete('/notes/:id', forceDeleteNote);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle', toggleUserStatus);

module.exports = router;
