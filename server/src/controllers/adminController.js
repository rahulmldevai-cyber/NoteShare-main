const User = require('../models/User');
const Note = require('../models/Note');
const Comment = require('../models/Comment');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { deleteFromCloudinary } = require('../middleware/upload');
const { createNotification } = require('../services/notificationService');

const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalNotes, pendingNotes, totalDownloads] = await Promise.all([
    User.countDocuments(),
    Note.countDocuments({ status: 'approved' }),
    Note.countDocuments({ status: 'pending' }),
    Note.aggregate([{ $group: { _id: null, total: { $sum: '$downloadCount' } } }]),
  ]);

  const recentNotes = await Note.find().sort({ createdAt: -1 }).limit(5)
    .populate('author', 'name avatar');

  new ApiResponse(200, {
    stats: { totalUsers, totalNotes, pendingNotes, totalDownloads: totalDownloads[0]?.total || 0 },
    recentNotes,
  }).send(res);
});

const getPendingNotes = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [notes, total] = await Promise.all([
    Note.find({ status: 'pending' }).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit))
      .populate('author', 'name avatar email'),
    Note.countDocuments({ status: 'pending' }),
  ]);

  new ApiResponse(200, {
    notes,
    pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
  }).send(res);
});

const approveNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) throw ApiError.notFound('Note not found');

  note.status = 'approved';
  note.rejectionReason = undefined;
  await note.save();

  await createNotification({
    recipient: note.author, sender: req.user._id, type: 'approval',
    message: `Your note "${note.title}" has been approved!`, note: note._id,
  });

  new ApiResponse(200, { note }, 'Note approved').send(res);
});

const rejectNote = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  if (!reason) throw ApiError.badRequest('Rejection reason is required');

  const note = await Note.findById(req.params.id);
  if (!note) throw ApiError.notFound('Note not found');

  note.status = 'rejected';
  note.rejectionReason = reason;
  await note.save();

  await createNotification({
    recipient: note.author, sender: req.user._id, type: 'rejection',
    message: `Your note "${note.title}" was rejected. Reason: ${reason}`, note: note._id,
  });

  new ApiResponse(200, { note }, 'Note rejected').send(res);
});

const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const query = {};
  if (search) query.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];

  const [users, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit))
      .select('-refreshToken'),
    User.countDocuments(query),
  ]);

  new ApiResponse(200, {
    users,
    pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
  }).send(res);
});

const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound('User not found');
  if (user.role === 'admin') throw ApiError.forbidden('Cannot deactivate admin');

  user.isActive = !user.isActive;
  await user.save({ validateBeforeSave: false });
  new ApiResponse(200, { user }, `User ${user.isActive ? 'activated' : 'deactivated'}`).send(res);
});

const forceDeleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) throw ApiError.notFound('Note not found');

  await deleteFromCloudinary(note.filePublicId);
  await Promise.all([
    Note.findByIdAndDelete(req.params.id),
    Comment.deleteMany({ note: req.params.id }),
    require('../models/Rating').deleteMany({ note: req.params.id }),
    require('../models/Bookmark').deleteMany({ note: req.params.id }),
  ]);

  new ApiResponse(200, null, 'Note deleted by admin').send(res);
});

module.exports = { getDashboardStats, getPendingNotes, approveNote, rejectNote, getAllUsers, toggleUserStatus, forceDeleteNote };
