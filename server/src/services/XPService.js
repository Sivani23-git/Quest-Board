import { User } from '../models/User.js';
import { XPTransaction } from '../models/XPTransaction.js';
import { calculateLevel, getLevelProgress } from '../utils/levelUtils.js';
import { NotificationService } from './NotificationService.js';
import { ActivityService } from './ActivityService.js';

export class XPService {
  /**
   * Awards XP to a user with strict idempotency protection.
   * @param {string} userId
   * @param {number} amount
   * @param {string} source ('quest' | 'achievement' | 'quiz' | 'coding' | 'challenge' | 'streak_bonus' | 'admin')
   * @param {string|null} referenceId
   * @param {string|null} referenceModel
   * @param {string} description
   */
  static async award(userId, amount, source, referenceId = null, referenceModel = null, description = 'XP Award') {
    if (!amount || amount <= 0) return { awarded: 0, levelUp: null };

    // Idempotency check for referenced awards
    if (referenceId) {
      const existing = await XPTransaction.findOne({
        userId,
        referenceId,
        source,
      });
      if (existing) {
        return { awarded: 0, duplicate: true, levelUp: null };
      }
    }

    try {
      // 1. Create the immutable ledger record
      await XPTransaction.create({
        userId,
        amount,
        source,
        referenceId,
        referenceModel,
        description,
      });
    } catch (err) {
      // E11000 duplicate key error means concurrent attempt already awarded it
      if (err.code === 11000) {
        return { awarded: 0, duplicate: true, levelUp: null };
      }
      throw err;
    }

    // 2. Atomically update totalXP and compute level progression
    const user = await User.findById(userId);
    if (!user) return { awarded: amount, levelUp: null };

    const previousLevel = user.level || 1;
    const newTotalXP = (user.totalXP || 0) + amount;
    const newLevel = calculateLevel(newTotalXP);

    user.totalXP = newTotalXP;
    let levelUpData = null;

    if (newLevel > previousLevel) {
      user.level = newLevel;
      levelUpData = {
        previousLevel,
        newLevel,
        totalXP: newTotalXP,
      };

      // Notify and log level up
      await NotificationService.create(userId, {
        type: 'level_up',
        title: `Level Up! Reached Level ${newLevel}`,
        message: `Congratulations! Your journey has advanced. You are now Level ${newLevel}!`,
        referenceId: user._id,
        referenceModel: 'User',
      });

      await ActivityService.log(userId, {
        type: 'level_up',
        title: `Advanced to Level ${newLevel}`,
        referenceId: user._id,
        referenceModel: 'User',
        metadata: { level: newLevel, totalXP: newTotalXP },
      });
    }

    await user.save();

    return {
      awarded: amount,
      totalXP: newTotalXP,
      currentLevel: user.level,
      progress: getLevelProgress(newTotalXP),
      levelUp: levelUpData,
    };
  }
}
