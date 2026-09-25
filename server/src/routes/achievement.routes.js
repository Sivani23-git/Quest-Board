import { Router } from 'express';
import {
  getAchievements,
  getAchievementById,
  claimAchievement,
} from '../controllers/achievement.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', getAchievements);
router.get('/:id', getAchievementById);
router.post('/:id/claim', claimAchievement);

export default router;
