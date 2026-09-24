import { Quiz } from '../models/Quiz.js';
import { QuizAttempt } from '../models/QuizAttempt.js';
import { QuizService } from '../services/QuizService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

export const getQuizzes = asyncHandler(async (req, res, next) => {
  const quizzes = await Quiz.find()
    .populate('skillId', 'name icon color')
    .sort({ createdAt: -1 });

  // Get user pass status for quizzes
  const attempts = await QuizAttempt.find({ userId: req.user.userId, passed: true });
  const passedQuizIds = new Set(attempts.map((a) => a.quizId.toString()));

  const formatted = quizzes.map((q) => ({
    ...q.toObject(),
    isPassed: passedQuizIds.has(q._id.toString()),
  }));

  res.status(200).json({ success: true, data: formatted });
});

export const getQuizById = asyncHandler(async (req, res, next) => {
  // CorrectIndex is automatically excluded by select: false on question schema
  const quiz = await Quiz.findById(req.params.id).populate('skillId', 'name icon color');
  if (!quiz) {
    return next(new AppError('Quiz not found', 404));
  }

  const attempts = await QuizAttempt.find({ userId: req.user.userId, quizId: req.params.id }).sort(
    { createdAt: -1 }
  );

  res.status(200).json({
    success: true,
    data: {
      quiz,
      previousAttempts: attempts,
      hasPassed: attempts.some((a) => a.passed),
    },
  });
});

export const submitQuizAttempt = asyncHandler(async (req, res, next) => {
  const { answers, questId } = req.body;

  const result = await QuizService.submitAttempt(
    req.user.userId,
    req.params.id,
    answers,
    questId || null
  );

  res.status(200).json({
    success: true,
    message: result.passed ? 'Quiz passed! Great job!' : 'Quiz not passed. Try again!',
    data: result,
  });
});
