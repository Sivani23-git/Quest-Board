import axios from 'axios';
import { CodingChallenge } from '../models/CodingChallenge.js';
import { CodingSubmission } from '../models/CodingSubmission.js';
import { UserLanguageProgress } from '../models/UserLanguageProgress.js';
import { AppError } from '../utils/AppError.js';
import { ActivityService } from './ActivityService.js';
import { XPService } from './XPService.js';
import { CoinService } from './CoinService.js';
import { StreakService } from './StreakService.js';
import { AchievementService } from './AchievementService.js';

// Map languages to Piston execution runtimes
const PISTON_LANGUAGE_MAP = {
  javascript: { language: 'javascript', version: '18.15.0' },
  python: { language: 'python', version: '3.10.0' },
  java: { language: 'java', version: '15.0.2' },
  cpp: { language: 'c++', version: '10.2.0' },
};

export function calculateLanguageLevel(xp) {
  if (!xp || xp <= 0) return 1;
  // Level curve: Level 1 (0 XP), Level 2 (100 XP), Level 3 (250 XP), Level 4 (450 XP), etc.
  return Math.floor(Math.sqrt(xp / 25)) + 1;
}

function getPistonExecuteUrl() {
  const rawUrl =
    process.env.PISTON_BASE_URL ||
    process.env.PISTON_API_URL ||
    'http://localhost:2000/api/v2';

  const sanitized = rawUrl.replace(/\/+$/, '');
  if (sanitized.endsWith('/execute')) {
    return sanitized;
  }
  return `${sanitized}/execute`;
}

function normalizeOutput(str) {
  if (!str) return '';
  const trimmed = str.trim();
  try {
    const parsed = JSON.parse(trimmed);
    return JSON.stringify(parsed);
  } catch {
    return trimmed
      .replace(/\r\n/g, '\n')
      .replace(/\s+$/gm, '')
      .replace(/,\s+/g, ',');
  }
}

export class CodingService {
  /**
   * Executes code against test cases in an isolated sandbox.
   * @param {string} userId
   * @param {string} challengeId
   * @param {string} language
   * @param {string} code
   * @param {boolean} isSubmit - if true, executes both visible and hidden test cases
   * @param {string|null} questId
   */
  static async executeCode(userId, challengeId, language, code, isSubmit = false, questId = null) {
    const challenge = await CodingChallenge.findById(challengeId);
    if (!challenge) {
      throw new AppError('Coding challenge not found', 404);
    }

    const challengeLang = (challenge.language || 'python').toLowerCase();
    const targetLang = (language || challengeLang).toLowerCase();

    // Verify language matches challenge
    if (challengeLang !== targetLang) {
      throw new AppError(
        `This coding challenge belongs to the ${challengeLang.toUpperCase()} learning path. Code must be written in ${challengeLang}.`,
        400
      );
    }

    const runtime = PISTON_LANGUAGE_MAP[targetLang];
    if (!runtime) {
      throw new AppError(`Unsupported language: ${targetLang}`, 400);
    }

    // Select test cases to run
    const testCasesToRun = isSubmit
      ? challenge.testCases
      : challenge.testCases.filter((tc) => !tc.isHidden);

    if (testCasesToRun.length === 0) {
      throw new AppError('No test cases configured for this challenge', 400);
    }

    const pistonExecuteUrl = getPistonExecuteUrl();
    const testResults = [];
    let passedCount = 0;
    const startTime = Date.now();

    for (const testCase of testCasesToRun) {
      let response;
      try {
        response = await axios.post(
          pistonExecuteUrl,
          {
            language: runtime.language,
            version: runtime.version,
            files: [{ content: code }],
            stdin: testCase.input,
          },
          { timeout: 12000 }
        );
      } catch (err) {
        // Infrastructure / service error
        const isNetworkOrServiceError =
          !err.response ||
          err.response.status >= 500 ||
          err.response.status === 401 ||
          err.response.status === 403 ||
          err.code === 'ECONNREFUSED' ||
          err.code === 'ETIMEDOUT' ||
          err.code === 'ENOTFOUND' ||
          (typeof err.response?.data?.message === 'string' &&
            err.response.data.message.toLowerCase().includes('whitelist'));

        if (isNetworkOrServiceError) {
          throw new AppError('Code execution service is unavailable.', 503);
        }

        throw new AppError(err.response?.data?.message || 'Execution service error.', 400);
      }

      // Check for whitelist error in payload
      const rawStdout = response.data.run?.stdout || '';
      const rawStderr = response.data.run?.stderr || '';
      const rawOutput = response.data.run?.output || '';
      const combinedOutput = `${rawStdout} ${rawStderr} ${rawOutput}`.toLowerCase();

      if (combinedOutput.includes('whitelist only') || response.data.message?.toLowerCase?.().includes('whitelist')) {
        throw new AppError('Code execution service is unavailable.', 503);
      }

      const stdout = rawStdout.trim();
      const stderr = rawStderr.trim();
      const expected = (testCase.expected || '').trim();

      // Differentiate user runtime/compile error vs test pass/fail
      const isPassed = !stderr && normalizeOutput(stdout) === normalizeOutput(expected);
      if (isPassed) passedCount++;

      testResults.push({
        passed: isPassed,
        isHidden: testCase.isHidden,
        input: testCase.isHidden ? '[Hidden Test Case]' : testCase.input,
        expected: testCase.isHidden ? '[Hidden Output]' : expected,
        actual: stderr ? `Error: ${stderr}` : stdout,
        runtime: response.data.run?.time || 0,
      });
    }

    const totalTests = testCasesToRun.length;
    const isAllPassed = passedCount === totalTests;
    const totalExecutionTime = Date.now() - startTime;

    let submission = null;
    if (isSubmit) {
      submission = await CodingSubmission.create({
        userId,
        challengeId,
        questId,
        language: targetLang,
        code,
        status: isAllPassed ? 'passed' : 'failed',
        testResults,
        totalTests,
        passedTests: passedCount,
        executionTimeMs: totalExecutionTime,
        xpAwarded: false,
      });
    }

    let xpEarned = 0;
    let coinsEarned = 0;
    let isFirstSolve = false;
    let languageProgress = null;
    let xpResult = null;
    let coinResult = null;

    if (isSubmit && isAllPassed) {
      // Check if user has previously solved this challenge via UserLanguageProgress
      const existingProgress = await UserLanguageProgress.findOne({
        userId,
        language: targetLang,
        completedChallenges: challenge._id,
      });

      if (!existingProgress) {
        isFirstSolve = true;
        xpEarned = challenge.xpReward || 100;
        coinsEarned = challenge.coinReward || 25;

        // 1. Award Global XP
        xpResult = await XPService.award(
          userId,
          xpEarned,
          'coding',
          challenge._id,
          'CodingChallenge',
          `Solved ${challenge.language.toUpperCase()} Challenge: ${challenge.title}`
        );

        // 2. Award Coins
        coinResult = await CoinService.award(
          userId,
          coinsEarned,
          'coding',
          challenge._id,
          `Reward for ${challenge.title}`
        );

        // 3. Update User Language Learning Progress
        let progressDoc = await UserLanguageProgress.findOne({
          userId,
          language: targetLang,
        });

        if (!progressDoc) {
          progressDoc = await UserLanguageProgress.create({
            userId,
            language: targetLang,
            currentStage: challenge.learningStage || 1,
            completedChallenges: [challenge._id],
            languageXP: xpEarned,
            languageLevel: calculateLanguageLevel(xpEarned),
            lastActiveAt: new Date(),
          });
        } else {
          progressDoc.completedChallenges.addToSet(challenge._id);
          progressDoc.languageXP = (progressDoc.languageXP || 0) + xpEarned;
          progressDoc.languageLevel = calculateLanguageLevel(progressDoc.languageXP);
          progressDoc.lastActiveAt = new Date();

          // Unlock stage if all challenges in currentStage are completed
          const stageChallenges = await CodingChallenge.find({
            language: targetLang,
            learningStage: progressDoc.currentStage,
          }).select('_id');

          const completedSet = new Set(progressDoc.completedChallenges.map((id) => id.toString()));
          const isStageFinished = stageChallenges.every((c) => completedSet.has(c._id.toString()));

          if (isStageFinished && challenge.learningStage >= progressDoc.currentStage) {
            progressDoc.currentStage = challenge.learningStage + 1;
          }

          await progressDoc.save();
        }

        languageProgress = {
          language: targetLang,
          languageXP: progressDoc.languageXP,
          languageLevel: progressDoc.languageLevel,
          currentStage: progressDoc.currentStage,
          completedCount: progressDoc.completedChallenges.length,
        };

        // 4. Update Daily Streak
        await StreakService.update(userId);

        // 5. Evaluate Achievements
        await AchievementService.evaluate(userId);

        // 6. Log Activity
        await ActivityService.log(userId, {
          type: 'coding_solved',
          title: `Mastered ${challenge.language.toUpperCase()}: ${challenge.title}`,
          referenceId: challenge._id,
          referenceModel: 'CodingChallenge',
          metadata: {
            language: targetLang,
            challengeTitle: challenge.title,
            stage: challenge.learningStage,
            xp: xpEarned,
            coins: coinsEarned,
          },
        });

        submission.xpAwarded = true;
        await submission.save();
      } else {
        // Fetch current progress
        const progressDoc = await UserLanguageProgress.findOne({
          userId,
          language: targetLang,
        });

        if (progressDoc) {
          languageProgress = {
            language: targetLang,
            languageXP: progressDoc.languageXP,
            languageLevel: progressDoc.languageLevel,
            currentStage: progressDoc.currentStage,
            completedCount: progressDoc.completedChallenges.length,
          };
        }
      }
    }

    return {
      submissionId: submission?._id || null,
      status: submission?.status || (isAllPassed ? 'passed' : 'failed'),
      passedTests: passedCount,
      totalTests,
      isAllPassed,
      executionTimeMs: totalExecutionTime,
      testResults,
      xpEarned,
      coinsEarned,
      isFirstSolve,
      languageProgress,
      totalXP: xpResult?.totalXP,
      currentLevel: xpResult?.currentLevel,
      xpProgress: xpResult?.progress || null,
      levelUp: xpResult?.levelUp || null,
      coinBalance: coinResult?.coinBalance,
    };
  }
}
