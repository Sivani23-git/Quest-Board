import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';

import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route Imports
import authRoutes from './routes/auth.routes.js';
import questRoutes from './routes/quest.routes.js';
import goalRoutes from './routes/goal.routes.js';
import skillRoutes from './routes/skill.routes.js';
import achievementRoutes from './routes/achievement.routes.js';
import quizRoutes from './routes/quiz.routes.js';
import codingRoutes from './routes/coding.routes.js';
import rewardRoutes from './routes/reward.routes.js';
import challengeRoutes from './routes/challenge.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';
import socialRoutes from './routes/social.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();

// Trust reverse proxy (Render, Vercel, etc.) for correct client IP detection with rate limiter
app.set('trust proxy', 1);

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Dynamic CORS configuration supporting Localhost, Vercel, and configured CLIENT_URL
const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'https://quest-board-nine-pi.vercel.app',
];

const getAllowedOrigins = () => {
  const configured = (process.env.CLIENT_URL || '')
    .split(',')
    .map((url) => url.trim().replace(/\/+$/, ''))
    .filter(Boolean);
  return Array.from(new Set([...defaultAllowedOrigins, ...configured]));
};

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (server-to-server, curl, Postman, mobile)
    if (!origin) {
      return callback(null, true);
    }
    const cleanOrigin = origin.trim().replace(/\/+$/, '');
    const allowed = getAllowedOrigins();

    // Direct match, Vercel preview domain match, or localhost match
    if (
      allowed.includes(cleanOrigin) ||
      cleanOrigin.endsWith('.vercel.app') ||
      cleanOrigin.includes('localhost') ||
      cleanOrigin.includes('127.0.0.1')
    ) {
      return callback(null, true);
    }

    // Allow in non-production environments
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    return callback(new Error(`CORS origin '${origin}' not allowed by policy`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Global API Rate Limiter
app.use('/api/', apiLimiter);

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/quests', questRoutes);
app.use('/api/v1/goals', goalRoutes);
app.use('/api/v1/skills', skillRoutes);
app.use('/api/v1/achievements', achievementRoutes);
app.use('/api/v1/quizzes', quizRoutes);
app.use('/api/v1/coding', codingRoutes);
app.use('/api/v1/rewards', rewardRoutes);
app.use('/api/v1/challenges', challengeRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/leaderboard', leaderboardRoutes);
app.use('/api/v1/social', socialRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/admin', adminRoutes);

// Catch-all 404 handler for undefined routes
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot find route ${req.originalUrl} on this server.`,
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
