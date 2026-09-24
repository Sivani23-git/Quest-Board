import { Router } from 'express';
import {
  getCodingLanguages,
  getLanguagePath,
  getLanguageProgress,
  getLanguageChallenges,
  getCodingChallenges,
  getCodingChallengeById,
  getChallengeSubmissions,
  runCode,
  submitCode,
} from '../controllers/coding.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { codingLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(authenticate);

// Language Learning Path APIs
router.get('/languages', getCodingLanguages);
router.get('/languages/:language', getLanguagePath);
router.get('/languages/:language/progress', getLanguageProgress);
router.get('/languages/:language/challenges', getLanguageChallenges);

// Specific Challenge APIs
router.get('/challenges/:id', getCodingChallengeById);
router.get('/challenges/:id/submissions', getChallengeSubmissions);
router.post('/challenges/:id/run', codingLimiter, runCode);
router.post('/challenges/:id/submit', codingLimiter, submitCode);

// Backward-compatible routes
router.get('/', getCodingChallenges);
router.get('/:id', getCodingChallengeById);
router.post('/:id/run', codingLimiter, runCode);
router.post('/:id/submit', codingLimiter, submitCode);

export default router;
