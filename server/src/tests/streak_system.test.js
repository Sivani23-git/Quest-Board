import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../app.js';
import { User } from '../models/User.js';
import { StreakService } from '../services/StreakService.js';
import { getCalendarDate, getCalendarDayDiff } from '../utils/dateUtils.js';

let mongoServer;

describe('🔥 Streak System Comprehensive Tests', () => {
  let userToken;
  let userId;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'streakrunner',
        email: 'runner@questboard.io',
        password: 'Password123!',
      });

    userToken = res.body.token;
    userId = res.body.user._id;
  }, 30000);

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('1. Date Normalization & Day Difference Unit Tests', () => {
    it('normalizes UTC and local dates correctly into YYYY-MM-DD', () => {
      const fixedDate = new Date('2026-09-26T18:30:00Z');
      expect(getCalendarDate(fixedDate)).toBe('2026-09-26');
      // In Asia/Kolkata (UTC+5:30), 18:30 UTC is 00:00 on Sept 27
      expect(getCalendarDate(fixedDate, { timezone: 'Asia/Kolkata' })).toBe('2026-09-27');
    });

    it('calculates calendar day differences accurately across months and years', () => {
      expect(getCalendarDayDiff('2026-09-26', '2026-09-26')).toBe(0);
      expect(getCalendarDayDiff('2026-09-26', '2026-09-27')).toBe(1);
      expect(getCalendarDayDiff('2026-09-26', '2026-09-28')).toBe(2);
      expect(getCalendarDayDiff('2026-09-30', '2026-10-01')).toBe(1);
      expect(getCalendarDayDiff('2026-12-31', '2027-01-01')).toBe(1);
    });
  });

  describe('2. Streak Progression & Lifecycle', () => {
    it('1. First activity initializes streak to 1', async () => {
      const result = await StreakService.update(userId);
      expect(result.currentStreak).toBe(1);
      expect(result.longestStreak).toBe(1);
      expect(result.streakUpdated).toBe(true);

      const user = await User.findById(userId);
      expect(user.currentStreak).toBe(1);
      expect(user.longestStreak).toBe(1);
      expect(user.lastActivityDate).toBe(getCalendarDate(new Date()));
    });

    it('2. Second activity on the SAME calendar day maintains streak at 1 (no double increment)', async () => {
      const result = await StreakService.update(userId);
      expect(result.currentStreak).toBe(1);
      expect(result.longestStreak).toBe(1);
      expect(result.streakUpdated).toBe(false);
      expect(result.streakMaintained).toBe(true);
    });

    it('3. Activity on the NEXT consecutive calendar day increments streak to 2', async () => {
      // Simulate yesterday's activity
      const user = await User.findById(userId);
      user.lastActivityDate = '2026-09-25';
      user.currentStreak = 1;
      await user.save();

      // Simulate completing activity on 2026-09-26
      const fixedToday = new Date('2026-09-26T12:00:00Z');
      const originalDateNow = Date.now;
      Date.now = () => fixedToday.getTime();

      try {
        const result = await StreakService.update(userId);
        expect(result.currentStreak).toBe(2);
        expect(result.longestStreak).toBe(2);
        expect(result.isConsecutive).toBe(true);
        expect(result.streakUpdated).toBe(true);
      } finally {
        Date.now = originalDateNow;
      }
    });

    it('4. Activity across three consecutive days increments streak to 3', async () => {
      const user = await User.findById(userId);
      user.lastActivityDate = '2026-09-26';
      user.currentStreak = 2;
      user.longestStreak = 2;
      await user.save();

      // Simulate day 3: 2026-09-27
      const fixedDay3 = new Date('2026-09-27T12:00:00Z');
      const originalDateNow = Date.now;
      Date.now = () => fixedDay3.getTime();

      try {
        const result = await StreakService.update(userId);
        expect(result.currentStreak).toBe(3);
        expect(result.longestStreak).toBe(3);
        expect(result.isConsecutive).toBe(true);
      } finally {
        Date.now = originalDateNow;
      }
    });

    it('5. Missed day resets streak to 1 while preserving longest streak', async () => {
      const user = await User.findById(userId);
      user.lastActivityDate = '2026-09-20'; // 7 days ago
      user.currentStreak = 3;
      user.longestStreak = 3;
      await user.save();

      const result = await StreakService.update(userId);
      expect(result.currentStreak).toBe(1);
      expect(result.longestStreak).toBe(3); // Longest preserved
      expect(result.isConsecutive).toBe(false);
      expect(result.streakUpdated).toBe(true);
    });

    it('6. Multiple activities of different types on the same day do not increase streak count', async () => {
      const user = await User.findById(userId);
      const today = getCalendarDate(new Date());
      user.lastActivityDate = today;
      user.currentStreak = 1;
      await user.save();

      const res1 = await StreakService.update(userId);
      const res2 = await StreakService.update(userId);
      const res3 = await StreakService.update(userId);

      expect(res1.currentStreak).toBe(1);
      expect(res2.currentStreak).toBe(1);
      expect(res3.currentStreak).toBe(1);
      expect(res1.streakUpdated).toBe(false);
    });
  });

  describe('3. API Endpoints & Auth Persistence', () => {
    it('7. Refreshing user (/api/v1/auth/me) returns persisted streak', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.currentStreak).toBe(1);
      expect(res.body.user.longestStreak).toBe(3);
    });

    it('8. Logging in again returns accurate streak', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'runner@questboard.io',
          password: 'Password123!',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.currentStreak).toBe(1);
    });

    it('9. Timezone awareness accurately compares dates across boundaries', async () => {
      const user = await User.findById(userId);
      user.lastActivityDate = '2026-09-26';
      user.currentStreak = 1;
      await user.save();

      // Passing timezone where it is Sept 27
      const result = await StreakService.update(userId, { timezone: 'Asia/Tokyo' });
      expect(result.currentStreak).toBe(2);
      expect(result.isConsecutive).toBe(true);
    });
  });
});
