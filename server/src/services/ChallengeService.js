import { Challenge } from '../models/Challenge.js';
import { ChallengeParticipation } from '../models/ChallengeParticipation.js';
import { User } from '../models/User.js';
import { Quest } from '../models/Quest.js';
import { UserQuestProgress } from '../models/UserQuestProgress.js';
import { CodingSubmission } from '../models/CodingSubmission.js';
import { UserLanguageProgress } from '../models/UserLanguageProgress.js';
import { QuizAttempt } from '../models/QuizAttempt.js';
import { XPService } from './XPService.js';
import { CoinService } from './CoinService.js';
import { NotificationService } from './NotificationService.js';
import { ActivityService } from './ActivityService.js';

export class ChallengeService {
  /**
   * Calculates a user's real progress for a given challenge.
   */
  static async calculateProgress(userId, challenge) {
    if (!challenge || !userId) return 0;
    const user = await User.findById(userId);
    if (!user) return 0;

    switch (challenge.type) {
      case 'quest_count': {
        const createdCompleted = await Quest.countDocuments({
          creatorId: userId,
          status: 'completed',
        });
        const officialCompleted = await UserQuestProgress.countDocuments({
          userId,
          status: 'completed',
        });
        return createdCompleted + officialCompleted;
      }

      case 'coding_count': {
        const passedSubs = await CodingSubmission.countDocuments({
          userId,
          status: 'passed',
        });
        if (passedSubs > 0) return passedSubs;

        // Fallback to distinct completed challenges in language progress
        const langProgress = await UserLanguageProgress.find({ userId });
        const uniqueSet = new Set();
        langProgress.forEach((lp) => {
          (lp.completedChallenges || []).forEach((cid) => uniqueSet.add(cid.toString()));
        });
        return uniqueSet.size;
      }

      case 'quiz_count': {
        return await QuizAttempt.countDocuments({
          userId,
          passed: true,
        });
      }

      case 'streak': {
        return user.currentStreak || user.streak?.currentStreak || 0;
      }

      case 'xp_target':
      case 'xp_total': {
        return user.totalXP || user.xp?.totalXP || 0;
      }

      case 'quest_categories':
      case 'category_count': {
        const completedUserQuests = await UserQuestProgress.find({
          userId,
          status: 'completed',
        }).populate('questId', 'category');

        const categories = new Set();
        completedUserQuests.forEach((up) => {
          if (up.questId?.category) {
            categories.add(up.questId.category.toLowerCase().trim());
          }
        });

        const createdQuests = await Quest.find({
          creatorId: userId,
          status: 'completed',
        });
        createdQuests.forEach((q) => {
          if (q.category) {
            categories.add(q.category.toLowerCase().trim());
          }
        });

        return categories.size;
      }

      default:
        return 0;
    }
  }

  /**
   * Evaluates all user challenge participations, updates progress, and awards rewards upon completion.
   */
  static async evaluateUserChallenges(userId) {
    if (!userId) return {};
    const participations = await ChallengeParticipation.find({ userId });
    const partMap = {};

    for (const part of participations) {
      try {
        const challenge = await Challenge.findById(part.challengeId);
        if (!challenge) {
          partMap[part.challengeId.toString()] = part;
          continue;
        }

        const progress = await this.calculateProgress(userId, challenge);
        part.currentProgress = progress;

        const target = challenge.requirement?.target || 1;
        if (progress >= target && !part.isCompleted) {
          part.isCompleted = true;
          part.completedAt = new Date();

          if (!part.xpAwarded) {
            await XPService.award(
              userId,
              challenge.xpReward || 250,
              'challenge',
              challenge._id,
              'Challenge',
              `Completed community challenge: ${challenge.title}`
            );

            if (challenge.coinReward && challenge.coinReward > 0) {
              await CoinService.award(
                userId,
                challenge.coinReward,
                'challenge',
                challenge._id,
                `Completed community challenge: ${challenge.title}`
              );
            }

            part.xpAwarded = true;

            await NotificationService.create(userId, {
              type: 'achievement',
              title: '🏆 Challenge Completed!',
              message: `You completed "${challenge.title}" and earned +${challenge.xpReward} XP and +${challenge.coinReward} Coins!`,
              referenceId: challenge._id,
              referenceModel: 'Challenge',
            });

            await ActivityService.log(userId, {
              type: 'challenge_completed',
              title: `Completed ${challenge.title}`,
              referenceId: challenge._id,
              referenceModel: 'Challenge',
              metadata: {
                xpReward: challenge.xpReward,
                coinReward: challenge.coinReward,
              },
            });
          }
        }

        await part.save();
        partMap[part.challengeId.toString()] = part;
      } catch (err) {
        console.warn(`[ChallengeService] Error evaluating challenge for user ${userId}:`, err.message);
        partMap[part.challengeId.toString()] = part;
      }
    }

    return partMap;
  }
}
