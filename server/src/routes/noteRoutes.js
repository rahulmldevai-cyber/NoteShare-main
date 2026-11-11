const express = require('express');
const router = express.Router();
const { createNote, getNotes, getNote, updateNote, deleteNote, downloadNote, getMyNotes } = require('../controllers/noteController');
const { protect, optionalAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createNote: createSchema, updateNote: updateSchema, queryNotes } = require('../validators/noteValidator');
const { upload } = require('../middleware/upload');
const { uploadLimiter } = require('../middleware/rateLimiter');

router.get('/', optionalAuth, validate(queryNotes), getNotes);
router.get('/my-notes', protect, getMyNotes);
router.get('/:id', optionalAuth, getNote);
router.get('/:id/download', downloadNote);
router.post('/', protect, uploadLimiter, upload.single('file'), validate(createSchema), createNote);
router.put('/:id', protect, validate(updateSchema), updateNote);
router.delete('/:id', protect, deleteNote);

module.exports = router;
