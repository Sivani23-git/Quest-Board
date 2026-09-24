import { CodingChallenge } from '../models/CodingChallenge.js';
import { CodingSubmission } from '../models/CodingSubmission.js';
import { UserLanguageProgress } from '../models/UserLanguageProgress.js';
import { CodingService, calculateLanguageLevel } from '../services/CodingService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

export const SUPPORTED_LANGUAGES = [
  {
    id: 'python',
    name: 'Python',
    icon: '🐍',
    badgeColor: '#38BDF8',
    description: 'Learn Python from fundamentals to advanced problem solving and data structures.',
    curriculumSummary: 'Fundamentals → Control Flow → Strings → Collections → Functions → Problem Solving → DSA',
    totalStages: 8,
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: '🟨',
    badgeColor: '#FACC15',
    description: 'Learn modern JavaScript from core syntax and ES6+ to async architectures and DSA.',
    curriculumSummary: 'Fundamentals → Control Flow → Strings → Arrays & Methods → Objects → Closures → Async & Promises → DSA',
    totalStages: 8,
  },
  {
    id: 'java',
    name: 'Java',
    icon: '☕',
    badgeColor: '#FB923C',
    description: 'Master Java, Object-Oriented Design, Collections Framework, and algorithmic problem solving.',
    curriculumSummary: 'Fundamentals → Loops → Strings → Arrays & Matrices → OOP & Classes → Collections → Exceptions & Generics → DSA',
    totalStages: 8,
  },
  {
    id: 'cpp',
    name: 'C++',
    icon: '⚡',
    badgeColor: '#818CF8',
    description: 'Build robust foundational programming, memory models, STL mastery, and high-performance DSA.',
    curriculumSummary: 'Fundamentals → Control Structures → Functions & References → Arrays & Strings → STL Vectors → STL Maps & Sets → OOP → DSA',
    totalStages: 8,
  },
];

export const getCodingLanguages = asyncHandler(async (req, res, next) => {
  const userId = req.user.userId;

  // Fetch all user language progress docs
  const userProgressList = await UserLanguageProgress.find({ userId });
  const progressMap = new Map(userProgressList.map((p) => [p.language, p]));

  // Fetch challenge counts per language
  const languageStats = await CodingChallenge.aggregate([
    {
      $group: {
        _id: '$language',
        totalChallenges: { $sum: 1 },
        totalXP: { $sum: '$xpReward' },
      },
    },
  ]);
  const statsMap = new Map(languageStats.map((s) => [s._id, s]));

  // Solved challenges per language for this user
  const solvedSubmissions = await CodingSubmission.find({
    userId,
    status: 'passed',
  }).distinct('challengeId');

  const solvedSet = new Set(solvedSubmissions.map((id) => id.toString()));

  const languages = await Promise.all(
    SUPPORTED_LANGUAGES.map(async (lang) => {
      const stats = statsMap.get(lang.id) || { totalChallenges: 32, totalXP: 3200 };
      const progress = progressMap.get(lang.id);

      const allLangChallenges = await CodingChallenge.find({ language: lang.id }).select('_id');
      const completedCount = allLangChallenges.filter((c) => solvedSet.has(c._id.toString())).length;

      const progressPercent = stats.totalChallenges > 0
        ? Math.min(100, Math.round((completedCount / stats.totalChallenges) * 100))
        : 0;

      const languageXP = progress?.languageXP || 0;
      const languageLevel = progress?.languageLevel || calculateLanguageLevel(languageXP);
      const currentStage = progress?.currentStage || 1;

      return {
        ...lang,
        totalChallenges: stats.totalChallenges,
        totalXP: stats.totalXP,
        userProgress: {
          isStarted: completedCount > 0 || languageXP > 0,
          completedCount,
          progressPercent,
          languageXP,
          languageLevel,
          currentStage,
        },
      };
    })
  );

  res.status(200).json({
    success: true,
    data: languages,
  });
});

export const getLanguagePath = asyncHandler(async (req, res, next) => {
  const { language } = req.params;
  const langKey = language.toLowerCase();
  const langConfig = SUPPORTED_LANGUAGES.find((l) => l.id === langKey);

  if (!langConfig) {
    return next(new AppError(`Language '${language}' is not supported.`, 404));
  }

  const userId = req.user.userId;

  // Get user progress
  let progressDoc = await UserLanguageProgress.findOne({ userId, language: langKey });
  const userXP = progressDoc?.languageXP || 0;
  const userLevel = progressDoc?.languageLevel || calculateLanguageLevel(userXP);
  let currentStage = progressDoc?.currentStage || 1;

  // Get all challenges for this language sorted by stage and order
  const challenges = await CodingChallenge.find({ language: langKey })
    .select('-testCases')
    .sort({ learningStage: 1, order: 1 });

  // Get solved challenge IDs for this user
  const solvedSubmissions = await CodingSubmission.find({
    userId,
    language: langKey,
    status: 'passed',
  }).distinct('challengeId');

  const solvedSet = new Set(solvedSubmissions.map((id) => id.toString()));

  // Group challenges by stage
  const stageMap = new Map();
  for (const ch of challenges) {
    const stageNum = ch.learningStage || 1;
    if (!stageMap.has(stageNum)) {
      stageMap.set(stageNum, {
        stageNumber: stageNum,
        stageName: ch.stageName || `Stage ${stageNum}`,
        topic: ch.topic,
        challenges: [],
      });
    }

    stageMap.get(stageNum).challenges.push({
      ...ch.toObject(),
      isSolved: solvedSet.has(ch._id.toString()),
    });
  }

  const stages = [];
  for (const [stageNum, stageData] of stageMap.entries()) {
    const totalInStage = stageData.challenges.length;
    const completedInStage = stageData.challenges.filter((c) => c.isSolved).length;
    const isStageCompleted = totalInStage > 0 && completedInStage === totalInStage;

    // Stage 1 is always unlocked. Next stages unlock if previous stage is completed or user has advanced
    const isUnlocked = stageNum === 1 || stageNum <= currentStage || stageNum - 1 <= currentStage;

    stages.push({
      ...stageData,
      isUnlocked,
      totalChallenges: totalInStage,
      completedChallenges: completedInStage,
      isCompleted: isStageCompleted,
    });
  }

  const totalChallenges = challenges.length;
  const totalCompleted = challenges.filter((c) => solvedSet.has(c._id.toString())).length;
  const progressPercent = totalChallenges > 0 ? Math.round((totalCompleted / totalChallenges) * 100) : 0;

  res.status(200).json({
    success: true,
    data: {
      language: langConfig,
      userProgress: {
        languageXP: userXP,
        languageLevel: userLevel,
        currentStage,
        completedCount: totalCompleted,
        totalChallenges,
        progressPercent,
      },
      stages,
    },
  });
});

export const getLanguageProgress = asyncHandler(async (req, res, next) => {
  const { language } = req.params;
  const progress = await UserLanguageProgress.findOne({
    userId: req.user.userId,
    language: language.toLowerCase(),
  }).populate('completedChallenges', 'title difficulty xpReward coinReward');

  res.status(200).json({
    success: true,
    data: progress || {
      language,
      languageXP: 0,
      languageLevel: 1,
      currentStage: 1,
      completedChallenges: [],
    },
  });
});

export const getLanguageChallenges = asyncHandler(async (req, res, next) => {
  const { language } = req.params;
  const challenges = await CodingChallenge.find({ language: language.toLowerCase() })
    .select('-testCases')
    .sort({ learningStage: 1, order: 1 });

  const solved = await CodingSubmission.find({
    userId: req.user.userId,
    language: language.toLowerCase(),
    status: 'passed',
  }).distinct('challengeId');

  const solvedSet = new Set(solved.map((id) => id.toString()));

  const formatted = challenges.map((c) => ({
    ...c.toObject(),
    isSolved: solvedSet.has(c._id.toString()),
  }));

  res.status(200).json({
    success: true,
    data: formatted,
  });
});

export const getCodingChallenges = asyncHandler(async (req, res, next) => {
  const { language, difficulty, stage } = req.query;
  const filter = {};

  if (language) filter.language = language.toLowerCase();
  if (difficulty) filter.difficulty = difficulty.toLowerCase();
  if (stage) filter.learningStage = Number(stage);

  const challenges = await CodingChallenge.find(filter)
    .select('-testCases')
    .populate('skillId', 'name icon color')
    .sort({ language: 1, learningStage: 1, order: 1 });

  const solved = await CodingSubmission.find({
    userId: req.user.userId,
    status: 'passed',
  }).distinct('challengeId');

  const solvedIds = new Set(solved.map((id) => id.toString()));

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

  // Find next challenge in the same language learning path
  const nextChallenge = await CodingChallenge.findOne({
    language: challenge.language,
    $or: [
      { learningStage: challenge.learningStage, order: { $gt: challenge.order } },
      { learningStage: { $gt: challenge.learningStage } },
    ],
  })
    .select('_id title difficulty learningStage order')
    .sort({ learningStage: 1, order: 1 });

  res.status(200).json({
    success: true,
    data: {
      challenge: sanitizedChallenge,
      previousSubmissions,
      isSolved: previousSubmissions.some((s) => s.status === 'passed'),
      nextChallenge: nextChallenge || null,
    },
  });
});

export const getChallengeSubmissions = asyncHandler(async (req, res, next) => {
  const submissions = await CodingSubmission.find({
    userId: req.user.userId,
    challengeId: req.params.id,
  })
    .sort({ createdAt: -1 })
    .limit(20);

  res.status(200).json({
    success: true,
    data: submissions,
  });
});

export const runCode = asyncHandler(async (req, res, next) => {
  const { language, code } = req.body;
  if (!code) {
    return next(new AppError('Code is required to execute.', 400));
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
    message: result.isAllPassed ? 'All sample test cases passed!' : 'Some sample test cases failed.',
    data: result,
  });
});

export const submitCode = asyncHandler(async (req, res, next) => {
  const { language, code, questId } = req.body;
  if (!code) {
    return next(new AppError('Code is required to submit.', 400));
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
    message: result.isAllPassed ? 'Accepted! All test cases passed.' : 'Submission failed some test cases.',
    data: result,
  });
});
