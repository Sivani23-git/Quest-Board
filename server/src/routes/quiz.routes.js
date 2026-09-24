import { Router } from 'express';
import {
  getQuizzes,
  getQuizById,
  submitQuizAttempt,
} from '../controllers/quiz.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', getQuizzes);
router.get('/:id', getQuizById);
router.post('/:id/submit', submitQuizAttempt);

export default router;
