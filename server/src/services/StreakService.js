import { User } from '../models/User.js';
import { XPService } from './XPService.js';
import { STREAK_BONUS_XP } from '../config/constants.js';
import { getCalendarDate, getCalendarDayDiff } from '../utils/dateUtils.js';

export class StreakService {
  /**
   * Updates user streak based on local calendar dates upon completing a qualifying activity.
   * Prevents same-day multiple increments and awards daily bonus XP.
   *
   * @param {string} userId - MongoDB ObjectId of the user
   * @param {object} [options={}] - Optional timezone context { timezone, timezoneOffset }
   * @returns {Promise<{ currentStreak: number, longestStreak: number, streakUpdated: boolean, isConsecutive?: boolean, streakMaintained?: boolean }>}
   */
  static async update(userId, options = {}) {
    const user = await User.findById(userId);
    if (!user) return { currentStreak: 0, longestStreak: 0, streakUpdated: false };

    const todayDate = getCalendarDate(new Date(), options);
    const lastDate = user.lastActivityDate;

    // 1. Same Day Activity: already counted for today
    if (lastDate && lastDate === todayDate) {
      return {
        currentStreak: user.currentStreak || 1,
        longestStreak: Math.max(user.longestStreak || 0, user.currentStreak || 1),
        streakUpdated: false,
        streakMaintained: true,
      };
    }

    let isConsecutive = false;
    const dayDiff = getCalendarDayDiff(lastDate, todayDate);

    if (dayDiff === 1) {
      // 2. Maintained streak on consecutive day
      user.currentStreak = (user.currentStreak || 0) + 1;
      isConsecutive = true;
    } else {
      // 3. First-ever activity (lastDate is null) or broke streak after gap (dayDiff > 1 or negative)
      user.currentStreak = 1;
      isConsecutive = false;
    }

    user.longestStreak = Math.max(user.longestStreak || 0, user.currentStreak);
    user.lastActivityDate = todayDate;
    await user.save();

    // 4. Award daily streak bonus XP
    if (user.currentStreak > 0) {
      try {
        await XPService.award(
          userId,
          STREAK_BONUS_XP,
          'streak_bonus',
          null,
          null,
          `Daily streak bonus (Streak: ${user.currentStreak} day${user.currentStreak === 1 ? '' : 's'})`
        );
      } catch (err) {
        console.warn('[StreakService] Error awarding streak bonus XP:', err.message);
      }
    }

    return {
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      streakUpdated: true,
      isConsecutive,
    };
  }

  /**
   * Sanitizes user streak on read operations (e.g. getMe, login, profile view).
   * If more than 1 day has passed without activity, current active streak is 0.
   *
   * @param {object} user - User document or plain object
   * @param {object} [options={}] - Optional timezone context { timezone, timezoneOffset }
   * @returns {object} Sanitized user
   */
  static sanitizeUserStreak(user, options = {}) {
    if (!user || !user.lastActivityDate || !user.currentStreak) return user;
    const todayDate = getCalendarDate(new Date(), options);
    const dayDiff = getCalendarDayDiff(user.lastActivityDate, todayDate);

    if (dayDiff !== null && dayDiff > 1) {
      user.currentStreak = 0;
    }
    return user;
  }
}
