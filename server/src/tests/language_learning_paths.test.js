import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../app.js';
import { User } from '../models/User.js';
import { CodingChallenge } from '../models/CodingChallenge.js';
import { seedCodingChallenges } from '../config/seedCodingChallenges.js';
import { startPistonServer } from '../piston-service/index.js';
import jwt from 'jsonwebtoken';

let mongoServer;
let token;
let user;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  try {
    await startPistonServer(2000);
  } catch (err) {
    if (err.code !== 'EADDRINUSE') {
      console.warn('Piston startup warning:', err.message);
    }
  }

  user = await User.create({
    username: 'code_warrior',
    email: 'warrior@questboard.io',
    passwordHash: 'dummyhash',
    role: 'user',
    level: 1,
    totalXP: 0,
    coinBalance: 50,
  });

  token = jwt.sign(
    { userId: user._id.toString(), role: 'user' },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '1d' }
  );

  await seedCodingChallenges(user._id);
}, 30000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('🚀 QuestBoard Language Learning Paths & Coding Academy', () => {
  it('1. Should have seeded 128+ challenges across Python, JavaScript, Java, and C++', async () => {
    const counts = {
      python: await CodingChallenge.countDocuments({ language: 'python' }),
      javascript: await CodingChallenge.countDocuments({ language: 'javascript' }),
      java: await CodingChallenge.countDocuments({ language: 'java' }),
      cpp: await CodingChallenge.countDocuments({ language: 'cpp' }),
      total: await CodingChallenge.countDocuments(),
    };

    expect(counts.python).toBeGreaterThanOrEqual(30);
    expect(counts.javascript).toBeGreaterThanOrEqual(30);
    expect(counts.java).toBeGreaterThanOrEqual(30);
    expect(counts.cpp).toBeGreaterThanOrEqual(30);
    expect(counts.total).toBeGreaterThanOrEqual(120);
  });

  it('2. Should return all 4 supported languages with user progress summaries', async () => {
    const res = await request(app)
      .get('/api/v1/coding/languages')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(4);

    const ids = res.body.data.map((l) => l.id);
    expect(ids).toContain('python');
    expect(ids).toContain('javascript');
    expect(ids).toContain('java');
    expect(ids).toContain('cpp');
  });

  it('3. Should return structured learning path for Python with 8 stages', async () => {
    const res = await request(app)
      .get('/api/v1/coding/languages/python')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.stages.length).toBe(8);
    expect(res.body.data.stages[0].stageNumber).toBe(1);
    expect(res.body.data.stages[0].isUnlocked).toBe(true);
    expect(res.body.data.stages[0].challenges.length).toBeGreaterThanOrEqual(4);
  });

  it('4. Should run sample tests and submit Python challenge successfully', async () => {
    const pyChallenge = await CodingChallenge.findOne({ language: 'python', order: 1 });
    expect(pyChallenge).toBeDefined();

    // Sample run
    const runRes = await request(app)
      .post(`/api/v1/coding/challenges/${pyChallenge._id}/run`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        language: 'python',
        code: 'print("Hello, Python!")',
      });

    expect(runRes.status).toBe(200);
    expect(runRes.body.data.isAllPassed).toBe(true);

    // Official Submit
    const submitRes = await request(app)
      .post(`/api/v1/coding/challenges/${pyChallenge._id}/submit`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        language: 'python',
        code: 'print("Hello, Python!")',
      });

    expect(submitRes.status).toBe(200);
    expect(submitRes.body.data.isAllPassed).toBe(true);
    expect(submitRes.body.data.isFirstSolve).toBe(true);
    expect(submitRes.body.data.xpEarned).toBe(pyChallenge.xpReward);
    expect(submitRes.body.data.totalXP).toBe(pyChallenge.xpReward);
    expect(submitRes.body.data.xpProgress).toBeDefined();
    expect(submitRes.body.data.xpProgress.totalXP).toBe(pyChallenge.xpReward);
    expect(submitRes.body.data.coinBalance).toBe(50 + pyChallenge.coinReward);
  });

  it('5. Should prevent duplicate XP awards on duplicate submission', async () => {
    const pyChallenge = await CodingChallenge.findOne({ language: 'python', order: 1 });

    const submitRes = await request(app)
      .post(`/api/v1/coding/challenges/${pyChallenge._id}/submit`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        language: 'python',
        code: 'print("Hello, Python!")',
      });

    expect(submitRes.status).toBe(200);
    expect(submitRes.body.data.isAllPassed).toBe(true);
    expect(submitRes.body.data.isFirstSolve).toBe(false);
    expect(submitRes.body.data.xpEarned).toBe(0);
    expect(submitRes.body.data.totalXP).toBeUndefined();
  });

  it('6. Should allow solving JavaScript challenge on an independent learning path', async () => {
    const jsChallenge = await CodingChallenge.findOne({ language: 'javascript', order: 1 });
    expect(jsChallenge).toBeDefined();

    const submitRes = await request(app)
      .post(`/api/v1/coding/challenges/${jsChallenge._id}/submit`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        language: 'javascript',
        code: 'console.log("Hello, JavaScript!");',
      });

    expect(submitRes.status).toBe(200);
    expect(submitRes.body.data.isAllPassed).toBe(true);
    expect(submitRes.body.data.isFirstSolve).toBe(true);
    expect(submitRes.body.data.xpEarned).toBe(jsChallenge.xpReward);
  });

  it('7. Should track multi-language progress simultaneously and independently', async () => {
    const res = await request(app)
      .get('/api/v1/coding/languages')
      .set('Authorization', `Bearer ${token}`);

    const py = res.body.data.find((l) => l.id === 'python');
    const js = res.body.data.find((l) => l.id === 'javascript');
    const java = res.body.data.find((l) => l.id === 'java');
    const cpp = res.body.data.find((l) => l.id === 'cpp');

    expect(py.userProgress.isStarted).toBe(true);
    expect(py.userProgress.completedCount).toBe(1);

    expect(js.userProgress.isStarted).toBe(true);
    expect(js.userProgress.completedCount).toBe(1);

    expect(java.userProgress.isStarted).toBe(false);
    expect(cpp.userProgress.isStarted).toBe(false);
  });

  it('8. Should execute and submit Java challenge', async () => {
    const javaChallenge = await CodingChallenge.findOne({ language: 'java', order: 1 });
    expect(javaChallenge).toBeDefined();

    const submitRes = await request(app)
      .post(`/api/v1/coding/challenges/${javaChallenge._id}/submit`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        language: 'java',
        code: 'public class Solution { public static void main(String[] args) { System.out.println("Hello, Java!"); } }',
      });

    expect(submitRes.status).toBe(200);
    expect(submitRes.body.data.isAllPassed).toBe(true);
  });

  it('9. Should execute and submit C++ challenge', async () => {
    const cppChallenge = await CodingChallenge.findOne({ language: 'cpp', order: 1 });
    expect(cppChallenge).toBeDefined();

    const submitRes = await request(app)
      .post(`/api/v1/coding/challenges/${cppChallenge._id}/submit`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        language: 'cpp',
        code: '#include <iostream>\nusing namespace std;\nint main() { cout << "Hello, C++!" << endl; return 0; }',
      });

    expect(submitRes.status).toBe(200);
    expect(submitRes.body.data.isAllPassed).toBe(true);
  });

  it('10. Should include language mastery on user profile', async () => {
    const res = await request(app)
      .get(`/api/v1/users/profile/${user.username}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.languageProgress).toBeDefined();
    expect(res.body.data.languageProgress.length).toBeGreaterThanOrEqual(3);
  });
});
