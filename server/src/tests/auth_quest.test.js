import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../app.js';
import { seedDatabase } from '../config/seed.js';
import { startPistonServer } from '../piston-service/index.js';
import { CodingChallenge } from '../models/CodingChallenge.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  await seedDatabase();

  try {
    await startPistonServer(2000);
  } catch (err) {
    if (err.code !== 'EADDRINUSE') {
      console.warn('Piston startup warning:', err.message);
    }
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('⚔️ QuestBoard Comprehensive Integration Tests', () => {
  let userToken;
  let userId;
  let personalQuestId;
  let officialQuestId;
  let challengeId;

  it('1. Should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'herotester',
        email: 'hero@questboard.io',
        password: 'Password123!',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.level).toBe(1);
    expect(res.body.user.totalXP).toBe(0);
    expect(res.body.user.coinBalance).toBe(0);

    userToken = res.body.token;
    userId = res.body.user._id;
  });

  it('2. Should reject registration with duplicate email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'herotester2',
        email: 'hero@questboard.io',
        password: 'Password123!',
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('3. Should login the user and return JWT', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'hero@questboard.io',
        password: 'Password123!',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it('4. Should create a personal quest', async () => {
    const res = await request(app)
      .post('/api/v1/quests')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Morning Code Practice',
        description: 'Solve 1 algorithmic puzzle before 9 AM',
        category: 'coding',
        difficulty: 'medium',
        xpReward: 100,
        coinReward: 25,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Morning Code Practice');
    expect(res.body.data.isOfficial).toBe(false);
    expect(res.body.data.creatorId.toString()).toBe(userId.toString());

    personalQuestId = res.body.data._id;
  });

  it('5. Should complete a self-verified quest and award XP, Coins, Streak & Achievements', async () => {
    const res = await request(app)
      .post(`/api/v1/quests/${personalQuestId}/complete`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({});

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.quest.status).toBe('completed');
    expect(res.body.data.xpAwarded).toBe(100);
    expect(res.body.data.coinAwarded).toBe(25);
    expect(res.body.data.xpProgress).toBeDefined();
    expect(res.body.data.streak.currentStreak).toBe(1);

    // Should have automatically unlocked the "First Steps" achievement!
    const unlocked = res.body.data.unlockedAchievements;
    expect(unlocked.some((a) => a.name === 'First Steps')).toBe(true);

    // Claim the unlocked achievement reward to test claim endpoint & award coins (+15)
    const firstStepsAch = unlocked.find((a) => a.name === 'First Steps');
    const claimRes = await request(app)
      .post(`/api/v1/achievements/${firstStepsAch._id}/claim`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(claimRes.status).toBe(200);
    expect(claimRes.body.data.coinsEarned).toBe(15);
  });

  it('6. Should prevent duplicate completion of the same personal quest', async () => {
    const res = await request(app)
      .post(`/api/v1/quests/${personalQuestId}/complete`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('already been completed');
  });

  it('7. Should verify coin deduction in personal reward shop', async () => {
    // 1. Create reward
    const createRewardRes = await request(app)
      .post('/api/v1/rewards')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Espresso Coffee Break',
        coinCost: 20,
      });

    expect(createRewardRes.status).toBe(201);
    const rewardId = createRewardRes.body.data._id;

    // 2. Redeem reward
    const redeemRes = await request(app)
      .post(`/api/v1/rewards/${rewardId}/redeem`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(redeemRes.status).toBe(200);
    expect(redeemRes.body.data.coinBalance).toBe(20); // 25 earned from quest + 15 from achievement = 40; 40 - 20 = 20
  });

  it('8. Should return analytics and overview metrics', async () => {
    const res = await request(app)
      .get('/api/v1/analytics/overview')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.totalCompletedQuests).toBe(1);
    expect(res.body.data.weeklyXP).toBeGreaterThanOrEqual(100);
  });

  it('9. Should return leaderboard rankings', async () => {
    const res = await request(app)
      .get('/api/v1/leaderboard?period=all-time')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].username).toBeDefined();
  });

  it('10. Should return challenge details and NEVER leak reference solutions or hidden tests', async () => {
    const twoSum = await CodingChallenge.findOne({ title: 'Two Sum with Hash Map', language: 'python' }) ||
      await CodingChallenge.findOne({ language: 'python' });
    challengeId = twoSum._id;

    const res = await request(app)
      .get(`/api/v1/coding/${challengeId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    const challenge = res.body.data.challenge;

    // 1. Check starterCode exists and does not contain reference solutions
    expect(challenge.starterCode).toBeDefined();
    expect(challenge.starterCode.python || '').not.toContain('seen[complement]');
    expect(challenge.starterCode.javascript || '').not.toContain('seen[complement]');

    // 2. Assert hidden test cases are NOT exposed
    const hiddenCases = challenge.testCases.filter((tc) => tc.isHidden);
    expect(hiddenCases.length).toBe(0);

    // 3. Assert no reference solution or answer key fields exist
    expect(challenge.solution).toBeUndefined();
    expect(challenge.referenceSolution).toBeUndefined();
    expect(challenge.answer).toBeUndefined();
  });

  it('11. Should execute Run Samples with genuine Python code in local Piston sandbox', async () => {
    const pyCorrect = `import sys
import json

def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

if __name__ == "__main__":
    input_data = sys.stdin.read().splitlines()
    nums = json.loads(input_data[0])
    target = int(input_data[1])
    result = two_sum(nums, target)
    print(json.dumps(result))`;

    const res = await request(app)
      .post(`/api/v1/coding/${challengeId}/run`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        language: 'python',
        code: pyCorrect,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isAllPassed).toBe(true);
    expect(res.body.data.passedTests).toBe(2);
    expect(res.body.data.totalTests).toBe(2);
    expect(res.body.data.testResults[0].actual).toBe('[0, 1]');
    expect(res.body.data.testResults[1].actual).toBe('[1, 2]');
  });

  it('12. Should execute Run Samples with incorrect Python code and correctly fail tests', async () => {
    const pyIncorrect = `print("[999,999]")`;

    const res = await request(app)
      .post(`/api/v1/coding/${challengeId}/run`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        language: 'python',
        code: pyIncorrect,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isAllPassed).toBe(false);
    expect(res.body.data.passedTests).toBe(0);
    expect(res.body.data.testResults[0].actual).toBe('[999,999]');
  });

  it('13. Should Submit Solution with Python and pass all test cases including hidden ones', async () => {
    const pyCorrect = `import sys
import json

def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

if __name__ == "__main__":
    input_data = sys.stdin.read().splitlines()
    nums = json.loads(input_data[0])
    target = int(input_data[1])
    result = two_sum(nums, target)
    print(json.dumps(result))`;

    const res = await request(app)
      .post(`/api/v1/coding/${challengeId}/submit`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        language: 'python',
        code: pyCorrect,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.passedTests).toBeGreaterThanOrEqual(3);
    expect(res.body.data.totalTests).toBeGreaterThanOrEqual(3);
  });
});
