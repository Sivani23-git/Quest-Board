import { Router } from 'express';
import { getChallenges, joinChallenge } from '../controllers/challenge.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', getChallenges);
router.post('/:id/join', joinChallenge);

export default router;
