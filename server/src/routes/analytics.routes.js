import { Router } from 'express';
import {
  getOverview,
  getXPHistory,
  getCategoryStats,
  getHeatmap,
} from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/overview', getOverview);
router.get('/xp-history', getXPHistory);
router.get('/category-stats', getCategoryStats);
router.get('/heatmap', getHeatmap);

export default router;
