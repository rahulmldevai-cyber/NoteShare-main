const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const path = require('path');
const fs = require('fs');
const ApiError = require('../utils/ApiError');
const { ALLOWED_FILE_MIMES, MAX_FILE_SIZE } = require('../utils/constants');
const logger = require('../utils/logger');

// Local upload directory
const UPLOAD_DIR = path.join(__dirname, '../../uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Check if Cloudinary is properly configured
const isCloudinaryConfigured = () => {
  return (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_KEY !== 'your_api_key' &&
    process.env.CLOUDINARY_API_SECRET
  );
};

const cloudinaryConfigured = isCloudinaryConfigured();

if (!cloudinaryConfigured) {
  logger.warn('Cloudinary not configured. Files will be stored locally.');
} else {
  logger.info('Cloudinary is configured. Files will be uploaded to the cloud.');
}

// Multer memory storage (files stored in buffer, then uploaded to Cloudinary)
const storage = multer.memoryStorage();

// File filter - validate file types
const fileFilter = (req, file, cb) => {
  if (ALLOWED_FILE_MIMES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      ApiError.badRequest(
        `File type '${file.mimetype}' is not allowed. Accepted: PDF, JPEG, PNG, WebP, DOCX`
      ),
      false
    );
  }
};

// Multer upload instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
});

/**
 * Get file extension from mimetype
 */
const getExtension = (mimetype) => {
  const mimeToExt = {
    'application/pdf': '.pdf',
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  };
  return mimeToExt[mimetype] || '.pdf';
};

/**
 * Upload file buffer to Cloudinary or locally
 * @param {Buffer} buffer - File buffer from multer
 * @param {Object} options - Upload options (filename, mimetype)
 * @returns {Promise<Object>} Upload result with url and publicId
 */
const uploadToCloudinary = async (buffer, options = {}) => {
  const { originalname, mimetype } = options;

  // Fallback to local storage if Cloudinary not configured
  if (!cloudinaryConfigured) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = getExtension(mimetype);
    const filename = `${uniqueSuffix}${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    // Save file locally
    fs.writeFileSync(filepath, buffer);

    const localUrl = `/uploads/${filename}`;
    logger.info(`File saved locally: ${localUrl}`);

    return {
      public_id: filename,
      url: localUrl,
      secure_url: localUrl,
      format: ext.slice(1),
      bytes: buffer.length,
      local: true,
    };
  }

  // Upload to Cloudinary
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'college-notes',
        resource_type: 'auto',
        ...options,
      },
      (error, result) => {
        if (error) {
          reject(ApiError.internal(`File upload failed: ${error.message}`));
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

/**
 * Delete file from Cloudinary or locally
 * @param {string} publicId - File public ID or filename
 * @param {string} resourceType - Resource type (image, raw, video)
 * @param {boolean} isLocal - Whether file is stored locally
 */
const deleteFromCloudinary = async (publicId, resourceType = 'auto', isLocal = false) => {
  try {
    if (isLocal || !cloudinaryConfigured) {
      // Delete local file
      const filepath = path.join(UPLOAD_DIR, publicId);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        logger.info(`Local file deleted: ${publicId}`);
      }
      return;
    }
    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    // Log but don't throw - deletion failure shouldn't break the flow
    console.error(`Failed to delete file: ${error.message}`);
  }
};

/**
 * Determine file type from mimetype
 */
const getFileType = (mimetype) => {
  if (mimetype === 'application/pdf') return 'pdf';
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.includes('wordprocessingml')) return 'docx';
  return 'pdf';
};

module.exports = {
  upload,
  uploadToCloudinary,
  deleteFromCloudinary,
  getFileType,
};
