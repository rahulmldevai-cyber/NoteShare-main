module.exports = {
  ROLES: {
    STUDENT: 'student',
    ADMIN: 'admin',
  },

  NOTE_STATUS: {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
  },

  FILE_TYPES: {
    PDF: 'pdf',
    IMAGE: 'image',
    DOCX: 'docx',
  },

  NOTIFICATION_TYPES: {
    COMMENT: 'comment',
    APPROVAL: 'approval',
    REJECTION: 'rejection',
    RATING: 'rating',
    SYSTEM: 'system',
  },

  ALLOWED_FILE_MIMES: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],

  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB

  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 12,
    MAX_LIMIT: 50,
  },

  RATE_LIMITS: {
    GENERAL: { windowMs: 15 * 60 * 1000, max: 100 },
    AUTH: { windowMs: 15 * 60 * 1000, max: 10 },
    UPLOAD: { windowMs: 60 * 60 * 1000, max: 20 },
  },

  BCRYPT_SALT_ROUNDS: 12,
};
