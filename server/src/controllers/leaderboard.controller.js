import { LeaderboardService } from '../services/LeaderboardService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getLeaderboard = asyncHandler(async (req, res, next) => {
  const period = req.query.period || 'all-time';
  const limit = parseInt(req.query.limit, 10) || 50;

  const leaderboard = await LeaderboardService.getLeaderboard({
    period,
    userId: req.user?.userId || null,
    limit,
  });

  res.status(200).json({ success: true, period, data: leaderboard });
});
