import mongoose from 'mongoose';
import { XPTransaction } from '../models/XPTransaction.js';
import { CoinTransaction } from '../models/CoinTransaction.js';
import { Quest } from '../models/Quest.js';
import { UserQuestProgress } from '../models/UserQuestProgress.js';
import { Activity } from '../models/Activity.js';
import { subDays, startOfDay, format } from 'date-fns';

export class AnalyticsService {
  /**
   * Returns dashboard overview metrics.
   */
  static async getDashboardOverview(userId) {
    const objectUserId = new mongoose.Types.ObjectId(userId);

    const [completedPersonal, completedOfficial, inProgressQuests, xpThisWeek, coinsEarnedTotal] =
      await Promise.all([
        Quest.countDocuments({ creatorId: objectUserId, status: 'completed' }),
        UserQuestProgress.countDocuments({ userId: objectUserId, status: 'completed' }),
        Quest.countDocuments({ creatorId: objectUserId, status: 'in_progress' }),
        XPTransaction.aggregate([
          {
            $match: {
              userId: objectUserId,
              createdAt: { $gte: subDays(new Date(), 7) },
            },
          },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        CoinTransaction.aggregate([
          { $match: { userId: objectUserId, type: 'earned' } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
      ]);

    return {
      totalCompletedQuests: completedPersonal + completedOfficial,
      inProgressQuests,
      weeklyXP: xpThisWeek[0]?.total || 0,
      totalCoinsEarned: coinsEarnedTotal[0]?.total || 0,
    };
  }

  /**
   * Returns XP gain over time grouped by date for charts.
   */
  static async getXPHistory(userId, days = 30) {
    const objectUserId = new mongoose.Types.ObjectId(userId);
    const startDate = startOfDay(subDays(new Date(), days));

    const history = await XPTransaction.aggregate([
      {
        $match: {
          userId: objectUserId,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalXP: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return history.map((item) => ({
      date: item._id,
      xp: item.totalXP,
      events: item.count,
    }));
  }

  /**
   * Returns quest completion distribution by category and difficulty.
   */
  static async getCategoryDistribution(userId) {
    const objectUserId = new mongoose.Types.ObjectId(userId);

    const categories = await Quest.aggregate([
      { $match: { creatorId: objectUserId, status: 'completed' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const difficulties = await Quest.aggregate([
      { $match: { creatorId: objectUserId, status: 'completed' } },
      { $group: { _id: '$difficulty', count: { $sum: 1 } } },
    ]);

    return {
      byCategory: categories.map((c) => ({ name: c._id, value: c.count })),
      byDifficulty: difficulties.map((d) => ({ name: d._id, value: d.count })),
    };
  }

  /**
   * Returns activity heatmap data for the past 365 days.
   */
  static async getActivityHeatmap(userId) {
    const objectUserId = new mongoose.Types.ObjectId(userId);
    const startDate = startOfDay(subDays(new Date(), 365));

    const heatmap = await Activity.aggregate([
      {
        $match: {
          userId: objectUserId,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return heatmap.map((h) => ({ date: h._id, count: h.count }));
  }
}
