import axios from 'axios';
import { CodingChallenge } from '../models/CodingChallenge.js';
import { CodingSubmission } from '../models/CodingSubmission.js';
import { AppError } from '../utils/AppError.js';
import { ActivityService } from './ActivityService.js';

// Map languages to Piston execution runtimes
const PISTON_LANGUAGE_MAP = {
  javascript: { language: 'javascript', version: '18.15.0' },
  python: { language: 'python', version: '3.10.0' },
  java: { language: 'java', version: '15.0.2' },
  cpp: { language: 'c++', version: '10.2.0' },
};

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

    const runtime = PISTON_LANGUAGE_MAP[language.toLowerCase()];
    if (!runtime) {
      throw new AppError(`Unsupported language: ${language}`, 400);
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
        // Infrastructure / service error (connection refused, timeout, HTTP 5xx, or whitelist rejection)
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

        // If Piston returned a 400 (e.g. language not supported)
        throw new AppError(err.response?.data?.message || 'Execution service error.', 400);
      }

      // Check for whitelist error in payload if 200 was returned with error body
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

    const submission = await CodingSubmission.create({
      userId,
      challengeId,
      questId,
      language,
      code,
      status: isAllPassed ? 'passed' : 'failed',
      testResults,
      totalTests,
      passedTests: passedCount,
      executionTimeMs: totalExecutionTime,
    });

    if (isSubmit && isAllPassed) {
      await ActivityService.log(userId, {
        type: 'coding_solved',
        title: `Solved Challenge: ${challenge.title}`,
        referenceId: challenge._id,
        referenceModel: 'CodingChallenge',
        metadata: { language, challengeTitle: challenge.title },
      });
    }

    return {
      submissionId: submission._id,
      status: submission.status,
      passedTests: passedCount,
      totalTests,
      isAllPassed,
      executionTimeMs: totalExecutionTime,
      testResults,
    };
  }
}
