import { User } from '../models/User.js';
import { format, subDays } from 'date-fns';
import { XPService } from './XPService.js';
import { STREAK_BONUS_XP } from '../config/constants.js';

export class StreakService {
  /**
   * Updates user streak based on UTC calendar dates.
   * Prevents same-day multiple increments and awards daily bonus XP.
   */
  static async update(userId) {
    const user = await User.findById(userId);
    if (!user) return { currentStreak: 0, longestStreak: 0, updated: false };

    const now = new Date();
    const todayUTC = format(now, 'yyyy-MM-dd');
    const yesterdayUTC = format(subDays(now, 1), 'yyyy-MM-dd');

    const lastDate = user.lastActivityDate;

    // Same day activity: already counted for today
    if (lastDate === todayUTC) {
      return {
        currentStreak: user.currentStreak || 1,
        longestStreak: user.longestStreak || 1,
        streakUpdated: false,
        streakMaintained: true,
      };
    }

    let isConsecutive = false;
    if (lastDate === yesterdayUTC) {
      // Maintained streak on consecutive day
      user.currentStreak = (user.currentStreak || 0) + 1;
      isConsecutive = true;
    } else {
      // First activity or broke streak after gap
      user.currentStreak = 1;
    }

    user.longestStreak = Math.max(user.longestStreak || 0, user.currentStreak);
    user.lastActivityDate = todayUTC;
    await user.save();

    // Award daily streak bonus XP
    if (user.currentStreak > 0) {
      await XPService.award(
        userId,
        STREAK_BONUS_XP,
        'streak_bonus',
        null,
        null,
        `Daily streak bonus (Streak: ${user.currentStreak} days)`
      );
    }

    return {
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      streakUpdated: true,
      isConsecutive,
    };
  }
}
