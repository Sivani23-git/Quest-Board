import { Follow } from '../models/Follow.js';
import { Activity } from '../models/Activity.js';
import { NotificationService } from '../services/NotificationService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

export const followUser = asyncHandler(async (req, res, next) => {
  const targetUserId = req.params.userId;
  if (targetUserId === req.user.userId) {
    return next(new AppError('You cannot follow yourself.', 400));
  }

  const follow = await Follow.findOneAndUpdate(
    { followerId: req.user.userId, followingId: targetUserId },
    { $setOnInsert: { followerId: req.user.userId, followingId: targetUserId } },
    { upsert: true, new: true }
  );

  await NotificationService.create(targetUserId, {
    type: 'new_follower',
    title: 'New Follower!',
    message: `${req.user.username} is now following your quest progression.`,
    referenceId: req.user.userId,
    referenceModel: 'User',
  });

  res.status(200).json({ success: true, message: 'Followed user!', data: follow });
});

export const unfollowUser = asyncHandler(async (req, res, next) => {
  const targetUserId = req.params.userId;
  await Follow.findOneAndDelete({ followerId: req.user.userId, followingId: targetUserId });
  res.status(200).json({ success: true, message: 'Unfollowed user.' });
});

export const getSocialFeed = asyncHandler(async (req, res, next) => {
  const follows = await Follow.find({ followerId: req.user.userId });
  const followingIds = follows.map((f) => f.followingId);

  // Include user's own public activities as well
  const feedUsers = [...followingIds, req.user.userId];

  const activities = await Activity.find({
    userId: { $in: feedUsers },
    isPublic: true,
  })
    .populate('userId', 'username avatar level')
    .sort({ createdAt: -1 })
    .limit(30);

  res.status(200).json({ success: true, data: activities });
});
