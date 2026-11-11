const Note = require('../models/Note');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { uploadToCloudinary, deleteFromCloudinary, getFileType } = require('../middleware/upload');
const { NOTE_STATUS, PAGINATION } = require('../utils/constants');
const { createNotification } = require('../services/notificationService');

/**
 * @desc    Upload a new note
 * @route   POST /api/v1/notes
 * @access  Private
 */
const createNote = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw ApiError.badRequest('Please upload a file (PDF, image, or DOCX)');
  }

  // Upload file (Cloudinary or local storage)
  const result = await uploadToCloudinary(req.file.buffer, {
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
  });

  // Parse tags
  let tags = req.body.tags || [];
  if (typeof tags === 'string') {
    tags = tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
  }

  const note = await Note.create({
    title: req.body.title,
    description: req.body.description,
    subject: req.body.subject,
    course: req.body.course,
    semester: req.body.semester,
    university: req.body.university || req.user.university,
    tags,
    fileUrl: result.secure_url,
    filePublicId: result.public_id,
    fileLocal: result.local || false,
    fileType: getFileType(req.file.mimetype),
    fileSize: req.file.size,
    // Use same URL for thumbnail if local storage, otherwise apply Cloudinary transformation
    thumbnailUrl: result.local ? result.secure_url : result.secure_url.replace('/upload/', '/upload/c_fill,h_300,w_400/'),
    author: req.user._id,
  });

  await note.populate('author', 'name avatar');

  new ApiResponse(201, { note }, 'Note uploaded successfully. Pending admin approval.').send(res);
});

/**
 * @desc    Get all approved notes with search, filters, pagination
 * @route   GET /api/v1/notes
 * @access  Public
 */
const getNotes = asyncHandler(async (req, res) => {
  const {
    search,
    subject,
    course,
    semester,
    sort = 'latest',
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.DEFAULT_LIMIT,
  } = req.query;

  const query = { status: NOTE_STATUS.APPROVED };

  // Full-text search
  if (search) {
    query.$text = { $search: search };
  }

  // Filters
  if (subject) query.subject = new RegExp(subject, 'i');
  if (course) query.course = new RegExp(course, 'i');
  if (semester) query.semester = parseInt(semester);

  // Sort options
  const sortOptions = {
    latest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    popular: { downloadCount: -1 },
    rating: { averageRating: -1 },
    downloads: { downloadCount: -1 },
  };

  const sortBy = sortOptions[sort] || sortOptions.latest;

  // Add text score to sort if searching
  if (search) {
    sortBy.score = { $meta: 'textScore' };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [notes, total] = await Promise.all([
    Note.find(query)
      .select(search ? { score: { $meta: 'textScore' } } : {})
      .sort(sortBy)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('author', 'name avatar university'),
    Note.countDocuments(query),
  ]);

  new ApiResponse(200, {
    notes,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  }).send(res);
});

/**
 * @desc    Get single note by ID
 * @route   GET /api/v1/notes/:id
 * @access  Public
 */
const getNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id)
    .populate('author', 'name avatar university bio');

  if (!note) {
    throw ApiError.notFound('Note not found');
  }

  // Only show approved notes to non-admins and non-authors
  if (note.status !== NOTE_STATUS.APPROVED) {
    const isAuthor = req.user && note.author._id.toString() === req.user._id.toString();
    const isAdmin = req.user && req.user.role === 'admin';
    if (!isAuthor && !isAdmin) {
      throw ApiError.notFound('Note not found');
    }
  }

  // Increment view count
  await Note.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });

  new ApiResponse(200, { note }).send(res);
});

/**
 * @desc    Update own note
 * @route   PUT /api/v1/notes/:id
 * @access  Private
 */
const updateNote = asyncHandler(async (req, res) => {
  let note = await Note.findById(req.params.id);

  if (!note) {
    throw ApiError.notFound('Note not found');
  }

  // Only author or admin can update
  if (note.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw ApiError.forbidden('You can only update your own notes');
  }

  // Parse tags
  let tags = req.body.tags;
  if (typeof tags === 'string') {
    tags = tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
    req.body.tags = tags;
  }

  // If author updates, reset to pending for re-moderation
  if (note.author.toString() === req.user._id.toString() && req.user.role !== 'admin') {
    req.body.status = NOTE_STATUS.PENDING;
  }

  note = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('author', 'name avatar');

  new ApiResponse(200, { note }, 'Note updated successfully').send(res);
});

/**
 * @desc    Delete own note
 * @route   DELETE /api/v1/notes/:id
 * @access  Private
 */
const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    throw ApiError.notFound('Note not found');
  }

  // Only author or admin can delete
  if (note.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw ApiError.forbidden('You can only delete your own notes');
  }

  // Delete file from Cloudinary or local storage
  await deleteFromCloudinary(note.filePublicId, 'auto', note.fileLocal);

  await Note.findByIdAndDelete(req.params.id);

  // Clean up related data
  const Comment = require('../models/Comment');
  const Rating = require('../models/Rating');
  const Bookmark = require('../models/Bookmark');
  await Promise.all([
    Comment.deleteMany({ note: req.params.id }),
    Rating.deleteMany({ note: req.params.id }),
    Bookmark.deleteMany({ note: req.params.id }),
  ]);

  new ApiResponse(200, null, 'Note deleted successfully').send(res);
});

/**
 * @desc    Download note file (increment counter)
 * @route   GET /api/v1/notes/:id/download
 * @access  Public
 */
const downloadNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note || note.status !== NOTE_STATUS.APPROVED) {
    throw ApiError.notFound('Note not found');
  }

  // Increment download count
  await Note.findByIdAndUpdate(req.params.id, { $inc: { downloadCount: 1 } });

  new ApiResponse(200, { downloadUrl: note.fileUrl }, 'Download URL generated').send(res);
});

/**
 * @desc    Get user's own notes
 * @route   GET /api/v1/notes/my-notes
 * @access  Private
 */
const getMyNotes = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 12 } = req.query;

  const query = { author: req.user._id };
  if (status) query.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [notes, total] = await Promise.all([
    Note.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Note.countDocuments(query),
  ]);

  new ApiResponse(200, {
    notes,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  }).send(res);
});

module.exports = {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
  downloadNote,
  getMyNotes,
};
