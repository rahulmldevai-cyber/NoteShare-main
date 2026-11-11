const express = require('express');
const router = express.Router({ mergeParams: true });
const { addComment, getComments, updateComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createComment, updateComment: updateSchema } = require('../validators/commentValidator');

router.get('/:noteId/comments', getComments);
router.post('/:noteId/comments', protect, validate(createComment), addComment);
router.put('/comments/:id', protect, validate(updateSchema), updateComment);
router.delete('/comments/:id', protect, deleteComment);

module.exports = router;
