import { Router } from 'express';
import { followUser, unfollowUser, getSocialFeed } from '../controllers/social.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.post('/follow/:userId', followUser);
router.delete('/follow/:userId', unfollowUser);
router.get('/feed', getSocialFeed);

export default router;
