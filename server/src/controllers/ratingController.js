const Rating = require('../models/Rating');
const Note = require('../models/Note');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { createNotification } = require('../services/notificationService');

const rateNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const { value } = req.body;

  if (!value || value < 1 || value > 5) {
    throw ApiError.badRequest('Rating must be between 1 and 5');
  }

  const note = await Note.findById(noteId);
  if (!note || note.status !== 'approved') throw ApiError.notFound('Note not found');
  if (note.author.toString() === req.user._id.toString()) throw ApiError.badRequest("Can't rate own note");

  const rating = await Rating.findOneAndUpdate(
    { note: noteId, user: req.user._id },
    { value },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  await Rating.calculateAverageRating(note._id);

  if (note.author.toString() !== req.user._id.toString()) {
    await createNotification({
      recipient: note.author, sender: req.user._id, type: 'rating',
      message: `${req.user.name} rated your note "${note.title}" ${value} stars`, note: noteId,
    });
  }

  new ApiResponse(200, { rating }, 'Rating submitted').send(res);
});

const getRatings = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const mongoose = require('mongoose');
  const [summary, userRating] = await Promise.all([
    Rating.aggregate([
      { $match: { note: new mongoose.Types.ObjectId(noteId) } },
      { $group: { _id: '$value', count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
    ]),
    req.user ? Rating.findOne({ note: noteId, user: req.user._id }) : null,
  ]);

  const note = await Note.findById(noteId).select('averageRating totalRatings');
  new ApiResponse(200, {
    averageRating: note?.averageRating || 0,
    totalRatings: note?.totalRatings || 0,
    distribution: summary,
    userRating: userRating?.value || null,
  }).send(res);
});

module.exports = { rateNote, getRatings };
