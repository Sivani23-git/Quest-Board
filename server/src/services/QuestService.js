import { Quest } from '../models/Quest.js';
import { UserQuestProgress } from '../models/UserQuestProgress.js';
import { QuizAttempt } from '../models/QuizAttempt.js';
import { CodingSubmission } from '../models/CodingSubmission.js';
import { XPService } from './XPService.js';
import { CoinService } from './CoinService.js';
import { StreakService } from './StreakService.js';
import { SkillService } from './SkillService.js';
import { AchievementService } from './AchievementService.js';
import { NotificationService } from './NotificationService.js';
import { ActivityService } from './ActivityService.js';
import { AppError } from '../utils/AppError.js';

export class QuestService {
  /**
   * Completes and verifies a quest, awarding XP, Coins, Streak, Skill progress, and Achievements.
   */
  static async completeQuest(userId, questId, { quizAttemptId = null, submissionId = null } = {}) {
    const quest = await Quest.findById(questId);
    if (!quest) {
      throw new AppError('Quest not found', 404);
    }

    // Check ownership for personal quests
    if (!quest.isOfficial && quest.creatorId.toString() !== userId.toString()) {
      throw new AppError('Forbidden. You cannot complete another user\'s personal quest.', 403);
    }

    // 1. Verification Type Specific Checks
    if (quest.verificationType === 'self') {
      // Personal quests check
      if (!quest.isOfficial && quest.status === 'completed') {
        throw new AppError('This quest has already been completed.', 400);
      }
      // Official quests check
      if (quest.isOfficial) {
        const existing = await UserQuestProgress.findOne({ userId, questId, status: 'completed' });
        if (existing) {
          throw new AppError('You have already completed this official quest.', 400);
        }
      }
    } else if (quest.verificationType === 'quiz') {
      if (!quizAttemptId) {
        throw new AppError('Quiz verification requires a valid passed quiz attempt ID.', 400);
      }
      const attempt = await QuizAttempt.findOne({ _id: quizAttemptId, userId });
      if (!attempt || !attempt.passed) {
        throw new AppError('Quiz attempt was not passed or does not belong to your account.', 400);
      }
      if (attempt.xpAwarded) {
        throw new AppError('This quiz attempt has already been redeemed for quest completion.', 400);
      }
      attempt.xpAwarded = true;
      await attempt.save();
    } else if (quest.verificationType === 'coding') {
      if (!submissionId) {
        throw new AppError('Coding verification requires a valid passing submission ID.', 400);
      }
      const submission = await CodingSubmission.findOne({ _id: submissionId, userId });
      if (!submission || submission.status !== 'passed') {
        throw new AppError('Code submission does not have passing status.', 400);
      }
      if (submission.xpAwarded) {
        throw new AppError('This code submission has already been redeemed for quest completion.', 400);
      }
      submission.xpAwarded = true;
      await submission.save();
    }

    // 2. Mark Quest / UserQuestProgress as Completed
    const completedAt = new Date();
    if (quest.isOfficial) {
      await UserQuestProgress.findOneAndUpdate(
        { userId, questId },
        {
          $set: {
            status: 'completed',
            completedAt,
            selfVerifiedAt: quest.verificationType === 'self' ? completedAt : null,
            verificationRef: quizAttemptId || submissionId || null,
          },
        },
        { upsert: true, new: true }
      );
    } else {
      quest.status = 'completed';
      quest.completedAt = completedAt;
      await quest.save();
    }

    // 3. Award XP & Coins (Idempotent server-side awards)
    const xpResult = await XPService.award(
      userId,
      quest.xpReward,
      'quest',
      quest._id,
      'Quest',
      `Completed Quest: ${quest.title}`
    );

    const coinResult = await CoinService.award(
      userId,
      quest.coinReward,
      'quest',
      quest._id,
      `Completed Quest: ${quest.title}`
    );

    // 4. Update Streak
    const streakResult = await StreakService.update(userId);

    // 5. Skill XP Award
    let skillResult = null;
    if (quest.associatedSkillId) {
      skillResult = await SkillService.addSkillXP(userId, quest.associatedSkillId, quest.xpReward);
    }

    // 6. Evaluate Achievements
    const unlockedAchievements = await AchievementService.evaluate(userId);

    // 7. Notification & Activity Logging
    await NotificationService.create(userId, {
      type: 'quest_completed',
      title: `Quest Completed: ${quest.title}`,
      message: `Earned +${quest.xpReward} XP and +${quest.coinReward} Coins!`,
      referenceId: quest._id,
      referenceModel: 'Quest',
    });

    await ActivityService.log(userId, {
      type: 'quest_completed',
      title: `Completed quest: ${quest.title}`,
      referenceId: quest._id,
      referenceModel: 'Quest',
      metadata: {
        category: quest.category,
        difficulty: quest.difficulty,
        xp: quest.xpReward,
        coins: quest.coinReward,
      },
    });

    return {
      quest,
      xpAwarded: quest.xpReward,
      coinAwarded: quest.coinReward,
      xpProgress: xpResult.progress,
      levelUp: xpResult.levelUp,
      streak: streakResult,
      skill: skillResult,
      unlockedAchievements,
    };
  }
}
