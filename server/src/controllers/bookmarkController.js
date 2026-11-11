const Bookmark = require('../models/Bookmark');
const Note = require('../models/Note');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const toggleBookmark = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);
  if (!note || note.status !== 'approved') throw ApiError.notFound('Note not found');

  const existing = await Bookmark.findOne({ user: req.user._id, note: noteId });
  if (existing) {
    await Bookmark.findByIdAndDelete(existing._id);
    new ApiResponse(200, { bookmarked: false }, 'Bookmark removed').send(res);
  } else {
    await Bookmark.create({ user: req.user._id, note: noteId });
    new ApiResponse(201, { bookmarked: true }, 'Note bookmarked').send(res);
  }
});

const getBookmarks = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [bookmarks, total] = await Promise.all([
    Bookmark.find({ user: req.user._id })
      .sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit))
      .populate({ path: 'note', populate: { path: 'author', select: 'name avatar' } }),
    Bookmark.countDocuments({ user: req.user._id }),
  ]);

  const notes = bookmarks.map((b) => b.note).filter(Boolean);
  new ApiResponse(200, {
    notes,
    pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
  }).send(res);
});

const checkBookmark = asyncHandler(async (req, res) => {
  const exists = await Bookmark.findOne({ user: req.user._id, note: req.params.noteId });
  new ApiResponse(200, { bookmarked: !!exists }).send(res);
});

module.exports = { toggleBookmark, getBookmarks, checkBookmark };
