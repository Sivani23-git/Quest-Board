import { AnalyticsService } from '../services/AnalyticsService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getOverview = asyncHandler(async (req, res, next) => {
  const overview = await AnalyticsService.getDashboardOverview(req.user.userId);
  res.status(200).json({ success: true, data: overview });
});

export const getXPHistory = asyncHandler(async (req, res, next) => {
  const days = parseInt(req.query.days, 10) || 30;
  const history = await AnalyticsService.getXPHistory(req.user.userId, days);
  res.status(200).json({ success: true, data: history });
});

export const getCategoryStats = asyncHandler(async (req, res, next) => {
  const stats = await AnalyticsService.getCategoryDistribution(req.user.userId);
  res.status(200).json({ success: true, data: stats });
});

export const getHeatmap = asyncHandler(async (req, res, next) => {
  const heatmap = await AnalyticsService.getActivityHeatmap(req.user.userId);
  res.status(200).json({ success: true, data: heatmap });
});
