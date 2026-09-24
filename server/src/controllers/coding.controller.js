import { CodingChallenge } from '../models/CodingChallenge.js';
import { CodingSubmission } from '../models/CodingSubmission.js';
import { CodingService } from '../services/CodingService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

export const getCodingChallenges = asyncHandler(async (req, res, next) => {
  const challenges = await CodingChallenge.find()
    .select('-testCases') // Exclude test cases in list view
    .populate('skillId', 'name icon color')
    .sort({ difficulty: 1, createdAt: -1 });

  // Check solved status per user
  const solved = await CodingSubmission.find({ userId: req.user.userId, status: 'passed' });
  const solvedIds = new Set(solved.map((s) => s.challengeId.toString()));

  const formatted = challenges.map((c) => ({
    ...c.toObject(),
    isSolved: solvedIds.has(c._id.toString()),
  }));

  res.status(200).json({ success: true, data: formatted });
});

export const getCodingChallengeById = asyncHandler(async (req, res, next) => {
  const challenge = await CodingChallenge.findById(req.params.id).populate(
    'skillId',
    'name icon color'
  );

  if (!challenge) {
    return next(new AppError('Coding challenge not found', 404));
  }

  // Sanitize: only return non-hidden test cases to client
  const sanitizedChallenge = challenge.toObject();
  sanitizedChallenge.testCases = sanitizedChallenge.testCases.filter((tc) => !tc.isHidden);

  const previousSubmissions = await CodingSubmission.find({
    userId: req.user.userId,
    challengeId: req.params.id,
  })
    .sort({ createdAt: -1 })
    .limit(10);

  res.status(200).json({
    success: true,
    data: {
      challenge: sanitizedChallenge,
      previousSubmissions,
      isSolved: previousSubmissions.some((s) => s.status === 'passed'),
    },
  });
});

export const runCode = asyncHandler(async (req, res, next) => {
  const { language, code } = req.body;
  if (!language || !code) {
    return next(new AppError('Language and code are required.', 400));
  }

  const result = await CodingService.executeCode(
    req.user.userId,
    req.params.id,
    language,
    code,
    false // Sample visible tests only
  );

  res.status(200).json({
    success: true,
    message: result.isAllPassed ? 'Sample tests passed!' : 'Some sample tests failed.',
    data: result,
  });
});

export const submitCode = asyncHandler(async (req, res, next) => {
  const { language, code, questId } = req.body;
  if (!language || !code) {
    return next(new AppError('Language and code are required.', 400));
  }

  const result = await CodingService.executeCode(
    req.user.userId,
    req.params.id,
    language,
    code,
    true, // All test cases (including hidden)
    questId || null
  );

  res.status(200).json({
    success: true,
    message: result.isAllPassed ? 'Accepted! All test cases passed.' : 'Submission failed test cases.',
    data: result,
  });
});
