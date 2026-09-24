import { Achievement } from '../models/Achievement.js';
import { UserAchievement } from '../models/UserAchievement.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAchievements = asyncHandler(async (req, res, next) => {
  const allAchievements = await Achievement.find().sort({ rarity: 1, xpReward: 1 });
  const userAchievements = await UserAchievement.find({ userId: req.user.userId });

  const earnedMap = {};
  userAchievements.forEach((ua) => {
    earnedMap[ua.achievementId.toString()] = ua.earnedAt;
  });

  const achievementsWithStatus = allAchievements.map((ach) => {
    const isEarned = Boolean(earnedMap[ach._id.toString()]);
    return {
      ...ach.toObject(),
      isEarned,
      earnedAt: earnedMap[ach._id.toString()] || null,
    };
  });

  res.status(200).json({
    success: true,
    data: achievementsWithStatus,
    earnedCount: userAchievements.length,
    totalCount: allAchievements.length,
  });
});
