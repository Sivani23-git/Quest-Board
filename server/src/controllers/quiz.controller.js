import { Quiz } from '../models/Quiz.js';
import { QuizAttempt } from '../models/QuizAttempt.js';
import { User } from '../models/User.js';
import { QuizService } from '../services/QuizService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

export const getQuizzes = asyncHandler(async (req, res, next) => {
  const quizzes = await Quiz.find()
    .populate('skillId', 'name icon color')
    .sort({ createdAt: 1 });

  // Get user attempts to calculate accurate status and progress for each quiz
  const userAttempts = await QuizAttempt.find({ userId: req.user.userId }).sort({ completedAt: -1 });

  const attemptsByQuiz = {};
  userAttempts.forEach((attempt) => {
    const qid = attempt.quizId.toString();
    if (!attemptsByQuiz[qid]) {
      attemptsByQuiz[qid] = [];
    }
    attemptsByQuiz[qid].push(attempt);
  });

  const formatted = quizzes.map((q) => {
    const qid = q._id.toString();
    const attempts = attemptsByQuiz[qid] || [];
    const isPassed = attempts.some((a) => a.passed);
    const bestScore = attempts.length > 0 ? Math.max(...attempts.map((a) => a.score)) : null;
    const lastAttempt = attempts[0] || null;

    let status = 'not_started';
    if (isPassed) {
      status = 'passed';
    } else if (attempts.length > 0) {
      status = 'failed';
    }

    return {
      _id: q._id,
      title: q.title,
      description: q.description,
      category: q.category || 'General Programming',
      difficulty: q.difficulty || 'intermediate',
      skillId: q.skillId,
      passingScore: q.passingScore || 70,
      timeLimit: q.timeLimit || null,
      xpReward: q.xpReward || 100,
      coinReward: q.coinReward || 25,
      maxAttempts: q.maxAttempts || 10,
      questionCount: q.questions.length,
      createdAt: q.createdAt,
      // User specific trial status
      isPassed,
      bestScore,
      attemptsCount: attempts.length,
      lastAttemptDate: lastAttempt ? lastAttempt.completedAt : null,
      status,
    };
  });

  res.status(200).json({ success: true, data: formatted });
});

export const getQuizById = asyncHandler(async (req, res, next) => {
  // CorrectIndex is automatically excluded by select: false on question schema
  const quiz = await Quiz.findById(req.params.id).populate('skillId', 'name icon color');
  if (!quiz) {
    return next(new AppError('Quiz not found', 404));
  }

  const attempts = await QuizAttempt.find({ userId: req.user.userId, quizId: req.params.id }).sort(
    { completedAt: -1 }
  );

  const bestScore = attempts.length > 0 ? Math.max(...attempts.map((a) => a.score)) : null;
  const hasPassed = attempts.some((a) => a.passed);

  res.status(200).json({
    success: true,
    data: {
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        category: quiz.category || 'General Programming',
        difficulty: quiz.difficulty || 'intermediate',
        skillId: quiz.skillId,
        passingScore: quiz.passingScore || 70,
        timeLimit: quiz.timeLimit || null,
        xpReward: quiz.xpReward || 100,
        coinReward: quiz.coinReward || 25,
        maxAttempts: quiz.maxAttempts || 10,
        questions: quiz.questions.map((q) => ({
          _id: q._id,
          text: q.text,
          options: q.options,
        })),
      },
      previousAttempts: attempts,
      bestScore,
      hasPassed,
      attemptsCount: attempts.length,
    },
  });
});

export const submitQuizAttempt = asyncHandler(async (req, res, next) => {
  const { answers, questId, timeTaken } = req.body;

  const result = await QuizService.submitAttempt(
    req.user.userId,
    req.params.id,
    answers,
    questId || null,
    timeTaken || 0
  );

  res.status(200).json({
    success: true,
    message: result.passed ? 'Trial passed! Great job!' : 'Trial not passed. Review explanations and retry!',
    data: result,
  });
});

export const getQuizStats = asyncHandler(async (req, res, next) => {
  const userId = req.user.userId;

  const user = await User.findById(userId).select('currentStreak totalXP');
  const attempts = await QuizAttempt.find({ userId });

  // 1. Quizzes completed (unique passed quizzes)
  const passedQuizIds = new Set(attempts.filter((a) => a.passed).map((a) => a.quizId.toString()));
  const quizzesCompleted = passedQuizIds.size;

  // 2. Average score across all completed attempts
  let averageScore = 0;
  if (attempts.length > 0) {
    const totalScore = attempts.reduce((acc, a) => acc + (a.score || 0), 0);
    averageScore = Math.round(totalScore / attempts.length);
  }

  // 3. Quiz XP sum
  const quizXP = attempts.reduce((acc, a) => acc + (a.xpEarned || 0), 0);

  // 4. Streak
  const quizStreak = user?.currentStreak || 0;

  res.status(200).json({
    success: true,
    data: {
      quizzesCompleted,
      averageScore,
      quizXP,
      quizStreak,
      totalAttempts: attempts.length,
    },
  });
});

export const getQuizHistory = asyncHandler(async (req, res, next) => {
  const attempts = await QuizAttempt.find({ userId: req.user.userId })
    .populate('quizId', 'title category difficulty passingScore xpReward coinReward')
    .sort({ completedAt: -1 })
    .limit(20);

  const formatted = attempts.map((a) => ({
    _id: a._id,
    quizId: a.quizId?._id || a.quizId,
    quizTitle: a.quizId?.title || 'Knowledge Trial',
    category: a.quizId?.category || 'General',
    difficulty: a.quizId?.difficulty || 'intermediate',
    score: a.score,
    passed: a.passed,
    attemptNumber: a.attemptNumber,
    timeTaken: a.timeTaken,
    xpEarned: a.xpEarned || 0,
    coinsEarned: a.coinsEarned || 0,
    completedAt: a.completedAt || a.createdAt,
  }));

  res.status(200).json({
    success: true,
    data: formatted,
  });
});
