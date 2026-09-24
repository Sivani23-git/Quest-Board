import { Router } from 'express';
import { getPublicProfile, updateProfile } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

// Optional auth for public profile viewing (to check if current user follows)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticate(req, res, next);
  }
  next();
};

router.get('/profile/:username', optionalAuth, getPublicProfile);
router.put('/me', authenticate, updateProfile);

export default router;
