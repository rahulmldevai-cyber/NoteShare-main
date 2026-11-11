const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
      required: [true, 'Rating value is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    note: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
      required: [true, 'Note reference is required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Unique compound index - one rating per user per note
ratingSchema.index({ note: 1, user: 1 }, { unique: true });

// Static method to calculate average rating for a note
ratingSchema.statics.calculateAverageRating = async function (noteId) {
  const result = await this.aggregate([
    { $match: { note: noteId } },
    {
      $group: {
        _id: '$note',
        averageRating: { $avg: '$value' },
        totalRatings: { $sum: 1 },
      },
    },
  ]);

  const Note = mongoose.model('Note');
  if (result.length > 0) {
    await Note.findByIdAndUpdate(noteId, {
      averageRating: Math.round(result[0].averageRating * 10) / 10,
      totalRatings: result[0].totalRatings,
    });
  } else {
    await Note.findByIdAndUpdate(noteId, {
      averageRating: 0,
      totalRatings: 0,
    });
  }
};

// Recalculate after save/remove
ratingSchema.post('save', function () {
  this.constructor.calculateAverageRating(this.note);
});

ratingSchema.post('findOneAndDelete', function (doc) {
  if (doc) {
    doc.constructor.calculateAverageRating(doc.note);
  }
});

module.exports = mongoose.model('Rating', ratingSchema);
