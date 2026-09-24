import { Router } from 'express';
import {
  getGoals,
  createGoal,
  getGoalById,
  updateGoal,
  deleteGoal,
} from '../controllers/goal.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', getGoals);
router.post('/', createGoal);
router.get('/:id', getGoalById);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);

export default router;
