const Comment = require('../models/Comment');
const Note = require('../models/Note');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { createNotification } = require('../services/notificationService');

/**
 * @desc    Add comment to a note
 * @route   POST /api/v1/notes/:noteId/comments
 * @access  Private
 */
const addComment = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const { content, parentComment } = req.body;

  // Verify note exists and is approved
  const note = await Note.findById(noteId);
  if (!note || note.status !== 'approved') {
    throw ApiError.notFound('Note not found');
  }

  // If replying, verify parent comment exists
  if (parentComment) {
    const parent = await Comment.findById(parentComment);
    if (!parent || parent.note.toString() !== noteId) {
      throw ApiError.notFound('Parent comment not found');
    }
  }

  const comment = await Comment.create({
    content,
    note: noteId,
    author: req.user._id,
    parentComment: parentComment || null,
  });

  await comment.populate('author', 'name avatar');

  // Send notification to note author (if commenter is not the author)
  if (note.author.toString() !== req.user._id.toString()) {
    await createNotification({
      recipient: note.author,
      sender: req.user._id,
      type: 'comment',
      message: `${req.user.name} commented on your note "${note.title}"`,
      note: noteId,
    });
  }

  new ApiResponse(201, { comment }, 'Comment added').send(res);
});

/**
 * @desc    Get comments for a note
 * @route   GET /api/v1/notes/:noteId/comments
 * @access  Public
 */
const getComments = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Get top-level comments with replies
  const [comments, total] = await Promise.all([
    Comment.find({ note: noteId, parentComment: null })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('author', 'name avatar')
      .populate({
        path: 'replies',
        populate: { path: 'author', select: 'name avatar' },
        options: { sort: { createdAt: 1 } },
      }),
    Comment.countDocuments({ note: noteId, parentComment: null }),
  ]);

  new ApiResponse(200, {
    comments,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  }).send(res);
});

/**
 * @desc    Update own comment
 * @route   PUT /api/v1/comments/:id
 * @access  Private
 */
const updateComment = asyncHandler(async (req, res) => {
  let comment = await Comment.findById(req.params.id);

  if (!comment) {
    throw ApiError.notFound('Comment not found');
  }

  if (comment.author.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('You can only edit your own comments');
  }

  comment = await Comment.findByIdAndUpdate(
    req.params.id,
    { content: req.body.content, isEdited: true },
    { new: true, runValidators: true }
  ).populate('author', 'name avatar');

  new ApiResponse(200, { comment }, 'Comment updated').send(res);
});

/**
 * @desc    Delete own comment
 * @route   DELETE /api/v1/comments/:id
 * @access  Private
 */
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    throw ApiError.notFound('Comment not found');
  }

  // Author or admin can delete
  if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw ApiError.forbidden('You can only delete your own comments');
  }

  // Delete replies too
  await Comment.deleteMany({ parentComment: req.params.id });
  await Comment.findByIdAndDelete(req.params.id);

  new ApiResponse(200, null, 'Comment deleted').send(res);
});

module.exports = { addComment, getComments, updateComment, deleteComment };
