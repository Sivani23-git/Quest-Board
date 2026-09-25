import { Achievement } from '../models/Achievement.js';
import { UserAchievement } from '../models/UserAchievement.js';
import { User } from '../models/User.js';
import { Quest } from '../models/Quest.js';
import { UserQuestProgress } from '../models/UserQuestProgress.js';
import { CodingSubmission } from '../models/CodingSubmission.js';
import { CodingChallenge } from '../models/CodingChallenge.js';
import { Quiz } from '../models/Quiz.js';
import { QuizAttempt } from '../models/QuizAttempt.js';
import { Skill } from '../models/Skill.js';
import { UserLanguageProgress } from '../models/UserLanguageProgress.js';
import { UserSkill } from '../models/UserSkill.js';
import { XPService } from './XPService.js';
import { CoinService } from './CoinService.js';
import { NotificationService } from './NotificationService.js';
import { ActivityService } from './ActivityService.js';
import { AppError } from '../utils/AppError.js';

export class AchievementService {
  /**
   * Evaluates all unearned achievements for a user and unlocks eligible ones.
   */
  static async evaluate(userId) {
    try {
      const allAchievements = await Achievement.find({ isActive: true });
      const userAchievements = await UserAchievement.find({ userId });
      const userAchMap = {};
      userAchievements.forEach((ua) => {
        userAchMap[ua.achievementId.toString()] = ua;
      });

      const newlyUnlocked = [];

      for (const achievement of allAchievements) {
        const existing = userAchMap[achievement._id.toString()];
        if (existing?.unlocked) continue;

        const { qualifies, currentProgress } = await this.checkRequirement(userId, achievement.requirements);

        if (qualifies) {
          const unlocked = await this.unlock(userId, achievement, currentProgress);
          if (unlocked) newlyUnlocked.push(unlocked);
        }
      }

      return newlyUnlocked;
    } catch (error) {
      console.error('[AchievementService] Evaluation error:', error.message);
      return [];
    }
  }

  /**
   * Evaluates requirements and returns both qualify boolean and current numeric progress.
   */
  static async checkRequirement(userId, req) {
    if (!req) return { qualifies: false, currentProgress: 0 };

    try {
      const user = await User.findById(userId);
      if (!user) return { qualifies: false, currentProgress: 0 };

      let currentProgress = 0;
      const threshold = req.threshold || 1;

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
          currentProgress = completedCount + officialCompleted;
          break;
        }

        case 'streak': {
          currentProgress = user.currentStreak || 0;
          break;
        }

        case 'level': {
          currentProgress = user.level || 1;
          break;
        }

        case 'xp_total': {
          currentProgress = user.totalXP || 0;
          break;
        }

        case 'coding_count': {
          currentProgress = await CodingSubmission.countDocuments({
            userId,
            status: 'passed',
          });
          break;
        }

        case 'coding_languages': {
          const subs = await CodingSubmission.find({ userId, status: 'passed' }).populate('challengeId', 'language');
          const langs = new Set();
          subs.forEach((s) => {
            const lang = s.challengeId?.language || s.language;
            if (lang) langs.add(lang.toLowerCase());
          });
          currentProgress = langs.size;
          break;
        }

        case 'academy_stage': {
          const langProgress = await UserLanguageProgress.find({ userId });
          const stagesCompleted = langProgress.filter(
            (lp) => (lp.completedChallenges?.length || 0) >= 4 || (lp.currentStage || 1) >= 2
          ).length;
          currentProgress = stagesCompleted;
          break;
        }

        case 'academy_full_path': {
          const langProgress = await UserLanguageProgress.find({ userId });
          const fullPaths = langProgress.filter(
            (lp) => (lp.completedChallenges?.length || 0) >= 32 || (lp.currentStage || 1) >= 8
          ).length;
          currentProgress = fullPaths;
          break;
        }

        case 'academy_languages_active': {
          const langProgress = await UserLanguageProgress.find({ userId });
          const activeLangs = langProgress.filter((lp) => (lp.completedChallenges?.length || 0) >= 1).length;
          currentProgress = activeLangs;
          break;
        }

        case 'quiz_count': {
          currentProgress = await QuizAttempt.countDocuments({
            userId,
            passed: true,
          });
          break;
        }

        case 'quiz_perfect': {
          currentProgress = await QuizAttempt.countDocuments({
            userId,
            score: 100,
          });
          break;
        }

        case 'skill_level_any': {
          const skills = await UserSkill.find({ userId });
          currentProgress = skills.length > 0 ? Math.max(...skills.map((s) => s.level || 1)) : 1;
          break;
        }

        case 'skills_multi_level': {
          const skills = await UserSkill.find({ userId, level: { $gte: 3 } });
          currentProgress = skills.length;
          break;
        }

        case 'skill_level': {
          if (req.skillId) {
            const us = await UserSkill.findOne({ userId, skillId: req.skillId });
            currentProgress = us?.level || 1;
          } else {
            const skills = await UserSkill.find({ userId });
            currentProgress = skills.length > 0 ? Math.max(...skills.map((s) => s.level || 1)) : 1;
          }
          break;
        }

        default:
          currentProgress = 0;
      }

      const qualifies = currentProgress >= threshold;
      return { qualifies, currentProgress };
    } catch (err) {
      console.warn(`[AchievementService] Requirement check error (${req?.type}):`, err.message);
      return { qualifies: false, currentProgress: 0 };
    }
  }

  /**
   * Unlocks an achievement and records user state.
   */
  static async unlock(userId, achievement, progress = 0) {
    try {
      const userAch = await UserAchievement.findOneAndUpdate(
        { userId, achievementId: achievement._id },
        {
          $set: {
            unlocked: true,
            unlockedAt: new Date(),
            earnedAt: new Date(),
            progress,
          },
          $setOnInsert: {
            claimed: false,
            claimedAt: null,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      await NotificationService.create(userId, {
        type: 'achievement_unlocked',
        title: `🏆 Achievement Unlocked: ${achievement.name}`,
        message: `${achievement.description} (+${achievement.xpReward} XP, +${achievement.coinReward} Coins ready to claim!)`,
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
    } catch (err) {
      if (err.code === 11000) return null;
      throw err;
    }
  }

  /**
   * Claims rewards for an unlocked achievement (idempotent).
   */
  static async claim(userId, achievementId) {
    const achievement = await Achievement.findById(achievementId);
    if (!achievement) {
      throw new AppError('Achievement not found', 404);
    }

    let userAch = await UserAchievement.findOne({ userId, achievementId });

    // If not yet unlocked in DB, evaluate real condition first
    if (!userAch || !userAch.unlocked) {
      const { qualifies, currentProgress } = await this.checkRequirement(userId, achievement.requirements);
      if (!qualifies) {
        throw new AppError('Achievement conditions have not been met yet.', 400);
      }
      userAch = await UserAchievement.findOneAndUpdate(
        { userId, achievementId },
        {
          $set: {
            unlocked: true,
            unlockedAt: new Date(),
            earnedAt: new Date(),
            progress: currentProgress,
            claimed: false,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    // Idempotency: If already claimed, return cleanly without duplicate award
    if (userAch.claimed) {
      const user = await User.findById(userId).select('totalXP coinBalance level');
      return {
        alreadyClaimed: true,
        xpEarned: 0,
        coinsEarned: 0,
        user,
        achievement,
      };
    }

    // Mark as claimed atomically
    userAch.claimed = true;
    userAch.claimedAt = new Date();
    await userAch.save();

    // Grant XP & Coins
    const xpRes = await XPService.award(
      userId,
      achievement.xpReward,
      'achievement',
      achievement._id,
      'Achievement',
      `Claimed trophy: ${achievement.name}`
    );

    const coinRes = await CoinService.award(
      userId,
      achievement.coinReward,
      'achievement',
      achievement._id,
      `Trophy reward: ${achievement.name}`
    );

    const user = await User.findById(userId).select('totalXP coinBalance level');

    return {
      alreadyClaimed: false,
      xpEarned: xpRes?.awarded || achievement.xpReward,
      coinsEarned: coinRes?.awarded || achievement.coinReward,
      user,
      achievement,
    };
  }

  /**
   * Retrieves full achievement overview for user including calculated progress for locked achievements.
   */
  static async getUserAchievements(userId) {
    // Run evaluation pass first so any newly met criteria unlock immediately
    await this.evaluate(userId);

    const allAchievements = await Achievement.find({ isActive: true }).sort({ category: 1, xpReward: 1 });
    const userAchievements = await UserAchievement.find({ userId });
    const userAchMap = {};
    userAchievements.forEach((ua) => {
      userAchMap[ua.achievementId.toString()] = ua;
    });

    let unlockedCount = 0;
    let claimedCount = 0;
    let totalAchievementXP = 0;

    const formattedAchievements = await Promise.all(
      allAchievements.map(async (ach) => {
        const ua = userAchMap[ach._id.toString()];
        const isUnlocked = Boolean(ua?.unlocked);
        const isClaimed = Boolean(ua?.claimed);
        const unlockedAt = ua?.unlockedAt || ua?.earnedAt || null;
        const claimedAt = ua?.claimedAt || null;

        const { currentProgress } = await this.checkRequirement(userId, ach.requirements);
        const target = ach.requirements?.threshold || 1;
        const progressClamped = isUnlocked ? target : Math.min(currentProgress, target);
        const percentage = Math.min(100, Math.round((progressClamped / target) * 100));

        if (isUnlocked) unlockedCount++;
        if (isClaimed) {
          claimedCount++;
          totalAchievementXP += ach.xpReward || 0;
        }

        return {
          _id: ach._id,
          name: ach.name,
          description: ach.description,
          category: ach.category || 'quests',
          rarity: ach.rarity || 'common',
          icon: ach.icon || 'trophy',
          xpReward: ach.xpReward || 50,
          coinReward: ach.coinReward || 15,
          requirements: ach.requirements,
          target,
          currentProgress: progressClamped,
          percentage,
          isUnlocked,
          isClaimed,
          unlockedAt,
          claimedAt,
        };
      })
    );

    // Recently unlocked achievements (last 5)
    const recentlyUnlocked = formattedAchievements
      .filter((a) => a.isUnlocked)
      .sort((a, b) => new Date(b.unlockedAt || 0) - new Date(a.unlockedAt || 0))
      .slice(0, 5);

    // Next closest trophies to unlock (2-4 locked achievements sorted by highest % completion)
    const nextTrophies = formattedAchievements
      .filter((a) => !a.isUnlocked)
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 4);

    return {
      achievements: formattedAchievements,
      stats: {
        totalCount: allAchievements.length,
        unlockedCount,
        claimedCount,
        achievementXP: totalAchievementXP,
        overallPercentage:
          allAchievements.length > 0
            ? Math.round((unlockedCount / allAchievements.length) * 100)
            : 0,
      },
      recentlyUnlocked,
      nextTrophies,
    };
  }
}
