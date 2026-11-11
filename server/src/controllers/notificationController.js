const Notification = require('../models/Notification');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit))
      .populate('sender', 'name avatar'),
    Notification.countDocuments({ recipient: req.user._id }),
    Notification.countDocuments({ recipient: req.user._id, isRead: false }),
  ]);

  new ApiResponse(200, {
    notifications, unreadCount,
    pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
  }).send(res);
});

const markAsRead = asyncHandler(async (req, res) => {
  const { ids } = req.body; // Array of notification IDs, or empty to mark all
  const query = { recipient: req.user._id, isRead: false };
  if (ids && ids.length > 0) query._id = { $in: ids };
  await Notification.updateMany(query, { isRead: true });
  new ApiResponse(200, null, 'Notifications marked as read').send(res);
});

const deleteNotification = asyncHandler(async (req, res) => {
  await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user._id });
  new ApiResponse(200, null, 'Notification deleted').send(res);
});

module.exports = { getNotifications, markAsRead, deleteNotification };
