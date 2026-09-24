import { Router } from 'express';
import {
  getAdminStats,
  getUsers,
  createOfficialQuest,
  createQuiz,
  createCodingChallenge,
  createAchievement,
  createSkill,
  createChallenge,
} from '../controllers/admin.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.post('/quests', createOfficialQuest);
router.post('/quizzes', createQuiz);
router.post('/coding', createCodingChallenge);
router.post('/achievements', createAchievement);
router.post('/skills', createSkill);
router.post('/challenges', createChallenge);

export default router;
