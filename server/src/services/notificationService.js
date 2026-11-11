const Notification = require('../models/Notification');
const { emitToUser } = require('../config/socket');
const logger = require('../utils/logger');

/**
 * Create a notification and emit via Socket.io
 */
const createNotification = async ({ recipient, sender, type, message, note }) => {
  try {
    const notification = await Notification.create({
      recipient,
      sender,
      type,
      message,
      note,
    });

    // Populate sender info for real-time delivery
    await notification.populate('sender', 'name avatar');

    // Emit real-time notification
    emitToUser(recipient.toString(), 'notification', notification);

    return notification;
  } catch (error) {
    logger.error(`Failed to create notification: ${error.message}`);
    // Don't throw — notification failure shouldn't break the main flow
  }
};

module.exports = { createNotification };
