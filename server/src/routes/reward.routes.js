import { Router } from 'express';
import {
  getRewards,
  createReward,
  redeemReward,
  deleteReward,
  getCoinTransactions,
} from '../controllers/reward.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', getRewards);
router.post('/', createReward);
router.post('/:id/redeem', redeemReward);
router.delete('/:id', deleteReward);
router.get('/transactions', getCoinTransactions);

export default router;
