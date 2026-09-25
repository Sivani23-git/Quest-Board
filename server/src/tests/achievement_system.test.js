import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../app.js';
import { User } from '../models/User.js';
import { Achievement } from '../models/Achievement.js';
import { seedAchievements } from '../config/seedAchievements.js';
import { AchievementService } from '../services/AchievementService.js';
import { XPService } from '../services/XPService.js';

let mongoServer;

describe('🏆 Achievement System Comprehensive Integration Tests', () => {
  let userToken;
  let userId;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    await seedAchievements();

    // Register test user
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'trophyhunter',
        email: 'trophy@questboard.io',
        password: 'Password123!',
      });

    userToken = res.body.token;
    userId = res.body.user._id;
  }, 15000);

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('1. Should return full achievement catalog of 23 achievements with 0 unlocked initially', async () => {
    const res = await request(app)
      .get('/api/v1/achievements')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(23);
    expect(res.body.stats.totalCount).toBe(23);
    expect(res.body.stats.unlockedCount).toBe(0);
    expect(res.body.stats.claimedCount).toBe(0);
    expect(res.body.stats.achievementXP).toBe(0);
  });

  it('2. Should evaluate Level Up achievement when user advances to Level 2', async () => {
    // Award 100 XP to reach Level 2
    await XPService.award(userId, 100, 'quest', new mongoose.Types.ObjectId(), 'Quest', 'Test quest XP');

    const user = await User.findById(userId);
    expect(user.level).toBe(2);

    // Call evaluate
    const newlyUnlocked = await AchievementService.evaluate(userId);
    expect(newlyUnlocked.some((a) => a.name === 'Level Up')).toBe(true);

    // Check GET /achievements
    const res = await request(app)
      .get('/api/v1/achievements')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.stats.unlockedCount).toBe(1);
    expect(res.body.stats.claimedCount).toBe(0);

    const levelUpAch = res.body.data.find((a) => a.name === 'Level Up');
    expect(levelUpAch).toBeDefined();
    expect(levelUpAch.isUnlocked).toBe(true);
    expect(levelUpAch.isClaimed).toBe(false);
    expect(levelUpAch.percentage).toBe(100);
  });

  it('3. Should claim reward for Level Up achievement and grant XP + Coins', async () => {
    const levelUpAchDoc = await Achievement.findOne({ name: 'Level Up' });
    const initialUser = await User.findById(userId);
    const initialXP = initialUser.totalXP;
    const initialCoins = initialUser.coinBalance;

    const res = await request(app)
      .post(`/api/v1/achievements/${levelUpAchDoc._id}/claim`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.alreadyClaimed).toBe(false);
    expect(res.body.data.xpEarned).toBe(levelUpAchDoc.xpReward);
    expect(res.body.data.coinsEarned).toBe(levelUpAchDoc.coinReward);

    const updatedUser = await User.findById(userId);
    expect(updatedUser.totalXP).toBe(initialXP + levelUpAchDoc.xpReward);
    expect(updatedUser.coinBalance).toBe(initialCoins + levelUpAchDoc.coinReward);

    // Check overview stats reflect claimed count
    const overviewRes = await request(app)
      .get('/api/v1/achievements')
      .set('Authorization', `Bearer ${userToken}`);

    expect(overviewRes.body.stats.claimedCount).toBe(1);
    expect(overviewRes.body.stats.achievementXP).toBe(levelUpAchDoc.xpReward);
  });

  it('4. Should be strictly idempotent and prevent duplicate reward claims', async () => {
    const levelUpAchDoc = await Achievement.findOne({ name: 'Level Up' });
    const userBefore = await User.findById(userId);

    const res = await request(app)
      .post(`/api/v1/achievements/${levelUpAchDoc._id}/claim`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.alreadyClaimed).toBe(true);
    expect(res.body.data.xpEarned).toBe(0);
    expect(res.body.data.coinsEarned).toBe(0);

    const userAfter = await User.findById(userId);
    expect(userAfter.totalXP).toBe(userBefore.totalXP);
    expect(userAfter.coinBalance).toBe(userBefore.coinBalance);
  });

  it('5. Should reject claim attempt for locked achievement', async () => {
    const legendaryAch = await Achievement.findOne({ name: 'Legendary Master' });

    const res = await request(app)
      .post(`/api/v1/achievements/${legendaryAch._id}/claim`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('conditions have not been met');
  });
});
