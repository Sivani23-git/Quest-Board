import { Router } from 'express';
import {
  getCodingChallenges,
  getCodingChallengeById,
  runCode,
  submitCode,
} from '../controllers/coding.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { codingLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(authenticate);

router.get('/', getCodingChallenges);
router.get('/:id', getCodingChallengeById);
router.post('/:id/run', codingLimiter, runCode);
router.post('/:id/submit', codingLimiter, submitCode);

export default router;
