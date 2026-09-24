import { Achievement } from '../models/Achievement.js';
import { UserAchievement } from '../models/UserAchievement.js';
import { User } from '../models/User.js';
import { Quest } from '../models/Quest.js';
import { UserQuestProgress } from '../models/UserQuestProgress.js';
import { CodingSubmission } from '../models/CodingSubmission.js';
import { QuizAttempt } from '../models/QuizAttempt.js';
import { XPService } from './XPService.js';
import { CoinService } from './CoinService.js';
import { NotificationService } from './NotificationService.js';
import { ActivityService } from './ActivityService.js';

export class AchievementService {
  /**
   * Evaluates all unearned achievements for a user and unlocks eligible ones.
   */
  static async evaluate(userId) {
    try {
      const allAchievements = await Achievement.find();
      const earned = await UserAchievement.find({ userId }).select('achievementId');
      const earnedIds = new Set(earned.map((e) => e.achievementId.toString()));

      const newlyUnlocked = [];

      for (const achievement of allAchievements) {
        if (earnedIds.has(achievement._id.toString())) continue;

        const qualifies = await this.checkRequirement(userId, achievement.requirements);
        if (qualifies) {
          const unlocked = await this.unlock(userId, achievement);
          if (unlocked) newlyUnlocked.push(unlocked);
        }
      }

      return newlyUnlocked;
    } catch (error) {
      console.error('[AchievementService] Evaluation error:', error.message);
      return [];
    }
  }

  static async checkRequirement(userId, req) {
    if (!req) return false;

    const user = await User.findById(userId);
    if (!user) return false;

    switch (req.type) {
      case 'quest_count': {
        const completedCount = await Quest.countDocuments({
          creatorId: userId,
          status: 'completed',
        });
        const officialCompleted = await UserQuestProgress.countDocuments({
          userId,
          status: 'completed',
        });
        return completedCount + officialCompleted >= req.threshold;
      }

      case 'streak': {
        return (user.currentStreak || 0) >= req.threshold;
      }

      case 'level': {
        return (user.level || 1) >= req.threshold;
      }

      case 'xp_total': {
        return (user.totalXP || 0) >= req.threshold;
      }

      case 'coding_count': {
        const solvedCount = await CodingSubmission.countDocuments({
          userId,
          status: 'passed',
        });
        return solvedCount >= req.threshold;
      }

      case 'quiz_count': {
        const passedCount = await QuizAttempt.countDocuments({
          userId,
          passed: true,
        });
        return passedCount >= req.threshold;
      }

      default:
        return false;
    }
  }

  static async unlock(userId, achievement) {
    try {
      await UserAchievement.create({
        userId,
        achievementId: achievement._id,
        earnedAt: new Date(),
      });
    } catch (err) {
      if (err.code === 11000) return null; // Already earned in concurrent request
      throw err;
    }

    // Award achievement bonus XP & Coins
    await XPService.award(
      userId,
      achievement.xpReward,
      'achievement',
      achievement._id,
      'Achievement',
      `Achievement unlocked: ${achievement.name}`
    );

    await CoinService.award(
      userId,
      achievement.coinReward,
      'achievement',
      achievement._id,
      `Achievement reward: ${achievement.name}`
    );

    await NotificationService.create(userId, {
      type: 'achievement_unlocked',
      title: `Achievement Unlocked: ${achievement.name}`,
      message: `${achievement.description} (+${achievement.xpReward} XP, +${achievement.coinReward} Coins)`,
      referenceId: achievement._id,
      referenceModel: 'Achievement',
    });

    await ActivityService.log(userId, {
      type: 'achievement_unlocked',
      title: `Unlocked achievement: ${achievement.name}`,
      referenceId: achievement._id,
      referenceModel: 'Achievement',
      metadata: { name: achievement.name, rarity: achievement.rarity },
    });

    return achievement;
  }
}
