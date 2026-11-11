const mongoose = require('mongoose');
const { NOTE_STATUS, FILE_TYPES } = require('../utils/constants');

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    course: {
      type: String,
      required: [true, 'Course is required'],
      trim: true,
    },
    semester: {
      type: Number,
      required: [true, 'Semester is required'],
      min: [1, 'Semester must be between 1 and 8'],
      max: [8, 'Semester must be between 1 and 8'],
    },
    university: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    filePublicId: {
      type: String,
      required: [true, 'File public ID is required'],
    },
    fileLocal: {
      type: Boolean,
      default: false,
    },
    fileType: {
      type: String,
      enum: Object.values(FILE_TYPES),
      required: true,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    status: {
      type: String,
      enum: Object.values(NOTE_STATUS),
      default: NOTE_STATUS.PENDING,
    },
    rejectionReason: {
      type: String,
      maxlength: [500, 'Rejection reason cannot exceed 500 characters'],
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Text search index for full-text search
noteSchema.index(
  { title: 'text', description: 'text', subject: 'text', tags: 'text' },
  { weights: { title: 10, subject: 5, tags: 3, description: 1 } }
);

// Compound indexes for filtering
noteSchema.index({ subject: 1, course: 1, semester: 1 });
noteSchema.index({ author: 1 });
noteSchema.index({ status: 1 });
noteSchema.index({ createdAt: -1 });
noteSchema.index({ downloadCount: -1 });
noteSchema.index({ averageRating: -1 });

// Virtual for comments
noteSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'note',
});

// Virtual for ratings
noteSchema.virtual('ratings', {
  ref: 'Rating',
  localField: '_id',
  foreignField: 'note',
});

module.exports = mongoose.model('Note', noteSchema);
