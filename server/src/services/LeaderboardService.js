import { User } from '../models/User.js';
import { XPTransaction } from '../models/XPTransaction.js';
import { Follow } from '../models/Follow.js';
import { subDays, startOfDay } from 'date-fns';

export class LeaderboardService {
  /**
   * Retrieves global or friend leaderboard based on period.
   */
  static async getLeaderboard({ period = 'all-time', userId = null, limit = 50 }) {
    if (period === 'all-time') {
      const users = await User.find({
        isOptedOutLeaderboard: false,
      })
        .sort({ totalXP: -1, level: -1 })
        .limit(limit)
        .select('username avatar level totalXP currentStreak bio');

      return users.map((u, index) => ({
        rank: index + 1,
        userId: u._id,
        username: u.username,
        avatar: u.avatar,
        level: u.level,
        xp: u.totalXP,
        currentStreak: u.currentStreak,
        bio: u.bio,
      }));
    }

    // Weekly or monthly time window
    const days = period === 'weekly' ? 7 : 30;
    const startDate = startOfDay(subDays(new Date(), days));

    const aggregated = await XPTransaction.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$userId',
          periodXP: { $sum: '$amount' },
        },
      },
      { $sort: { periodXP: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $match: {
          'user.isOptedOutLeaderboard': false,
        },
      },
      {
        $project: {
          userId: '$_id',
          username: '$user.username',
          avatar: '$user.avatar',
          level: '$user.level',
          xp: '$periodXP',
          currentStreak: '$user.currentStreak',
          bio: '$user.bio',
        },
      },
    ]);

    return aggregated.map((item, index) => ({
      rank: index + 1,
      ...item,
    }));
  }
}
