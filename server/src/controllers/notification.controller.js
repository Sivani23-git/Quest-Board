import { Notification } from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getNotifications = asyncHandler(async (req, res, next) => {
  const notifications = await Notification.find({ userId: req.user.userId })
    .sort({ createdAt: -1 })
    .limit(30);

  const unreadCount = await Notification.countDocuments({
    userId: req.user.userId,
    isRead: false,
  });

  res.status(200).json({ success: true, data: notifications, unreadCount });
});

export const markAsRead = asyncHandler(async (req, res, next) => {
  await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.userId },
    { $set: { isRead: true } }
  );
  res.status(200).json({ success: true, message: 'Notification marked as read.' });
});

export const markAllAsRead = asyncHandler(async (req, res, next) => {
  await Notification.updateMany({ userId: req.user.userId, isRead: false }, { $set: { isRead: true } });
  res.status(200).json({ success: true, message: 'All notifications marked as read.' });
});
