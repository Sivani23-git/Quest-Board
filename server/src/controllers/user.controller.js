import { User } from '../models/User.js';
import { Activity } from '../models/Activity.js';
import { UserAchievement } from '../models/UserAchievement.js';
import { UserSkill } from '../models/UserSkill.js';
import { UserLanguageProgress } from '../models/UserLanguageProgress.js';
import { Follow } from '../models/Follow.js';
import { getLevelProgress } from '../utils/levelUtils.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

export const getPublicProfile = asyncHandler(async (req, res, next) => {
  const { username } = req.params;
  const user = await User.findOne({ username });

  if (!user) {
    return next(new AppError('User profile not found.', 404));
  }

  // Privacy boundary check
  const isOwner = req.user?.userId && req.user.userId.toString() === user._id.toString();
  if (!user.isPublic && !isOwner) {
    return res.status(200).json({
      success: true,
      data: {
        username: user.username,
        avatar: user.avatar,
        isPrivate: true,
      },
    });
  }

  const [achievements, skills, activities, languageProgress, followerCount, followingCount, isFollowing] = await Promise.all([
    UserAchievement.find({ userId: user._id }).populate('achievementId').sort({ earnedAt: -1 }),
    UserSkill.find({ userId: user._id, isUnlocked: true }).populate('skillId').sort({ level: -1 }),
    Activity.find({ userId: user._id, isPublic: true }).sort({ createdAt: -1 }).limit(15),
    UserLanguageProgress.find({ userId: user._id }),
    Follow.countDocuments({ followingId: user._id }),
    Follow.countDocuments({ followerId: user._id }),
    req.user?.userId ? Follow.exists({ followerId: req.user.userId, followingId: user._id }) : false,
  ]);

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,
      level: user.level,
      totalXP: user.totalXP,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      isPublic: user.isPublic,
      followerCount,
      followingCount,
      isFollowing: Boolean(isFollowing),
      progress: getLevelProgress(user.totalXP),
      achievements,
      skills,
      languageProgress,
      activities,
    },
  });
});

export const updateProfile = asyncHandler(async (req, res, next) => {
  const { bio, avatar, isPublic, isOptedOutLeaderboard } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.userId,
    {
      ...(bio !== undefined && { bio }),
      ...(avatar !== undefined && { avatar }),
      ...(isPublic !== undefined && { isPublic }),
      ...(isOptedOutLeaderboard !== undefined && { isOptedOutLeaderboard }),
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully.',
    data: user,
  });
});
