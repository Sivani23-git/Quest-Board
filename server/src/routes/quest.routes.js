import { Router } from 'express';
import {
  getQuests,
  getOfficialQuests,
  getQuestById,
  createQuest,
  updateQuest,
  deleteQuest,
  completeQuest,
  getRecommendations,
} from '../controllers/quest.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { createQuestSchema, completeQuestSchema } from '../validation/quest.validation.js';

const router = Router();

router.use(authenticate);

router.get('/', getQuests);
router.post('/', validate(createQuestSchema), createQuest);
router.get('/official', getOfficialQuests);
router.get('/recommendations', getRecommendations);
router.get('/:id', getQuestById);
router.put('/:id', validate(createQuestSchema), updateQuest);
router.delete('/:id', deleteQuest);
router.post('/:id/complete', validate(completeQuestSchema), completeQuest);

export default router;
