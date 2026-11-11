const cloudinary = require('cloudinary').v2;
const logger = require('../utils/logger');

// Check if Cloudinary is properly configured
const isConfigured = process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY !== 'your_api_key' &&
  process.env.CLOUDINARY_API_SECRET;

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Verify connection
  cloudinary.api.ping()
    .then(() => logger.info('Cloudinary connected successfully'))
    .catch((err) => logger.warn(`Cloudinary connection failed: ${err.message}. File uploads will not work.`));
} else {
  logger.warn('Cloudinary not configured (missing credentials). Files will be stored locally.');
}

module.exports = cloudinary;
