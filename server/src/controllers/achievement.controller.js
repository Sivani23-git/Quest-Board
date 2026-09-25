import { AchievementService } from '../services/AchievementService.js';
import { Achievement } from '../models/Achievement.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

export const getAchievements = asyncHandler(async (req, res, next) => {
  const result = await AchievementService.getUserAchievements(req.user.userId);

  res.status(200).json({
    success: true,
    data: result.achievements,
    stats: result.stats,
    recentlyUnlocked: result.recentlyUnlocked,
    nextTrophies: result.nextTrophies,
    earnedCount: result.stats.unlockedCount,
    totalCount: result.stats.totalCount,
  });
});

export const getAchievementById = asyncHandler(async (req, res, next) => {
  const ach = await Achievement.findById(req.params.id);
  if (!ach) {
    return next(new AppError('Achievement not found', 404));
  }

  const result = await AchievementService.getUserAchievements(req.user.userId);
  const found = result.achievements.find((a) => a._id.toString() === req.params.id);

  res.status(200).json({
    success: true,
    data: found || ach,
  });
});

export const claimAchievement = asyncHandler(async (req, res, next) => {
  const result = await AchievementService.claim(req.user.userId, req.params.id);

  res.status(200).json({
    success: true,
    message: result.alreadyClaimed
      ? 'Achievement rewards already claimed.'
      : `Claimed +${result.xpEarned} XP and +${result.coinsEarned} Coins!`,
    data: result,
  });
});
