import { Router } from 'express';
import { getSkills, unlockSkill } from '../controllers/skill.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', getSkills);
router.post('/unlock/:id', unlockSkill);

export default router;
