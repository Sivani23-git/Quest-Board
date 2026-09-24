import { Router } from 'express';
import { getLeaderboard } from '../controllers/leaderboard.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.get('/', authenticate, getLeaderboard);

export default router;
