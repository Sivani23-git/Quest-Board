import { Quiz } from '../models/Quiz.js';
import { QuizAttempt } from '../models/QuizAttempt.js';
import { AppError } from '../utils/AppError.js';
import { ActivityService } from './ActivityService.js';
import { XPService } from './XPService.js';
import { CoinService } from './CoinService.js';
import { AchievementService } from './AchievementService.js';

export class QuizService {
  /**
   * Evaluates submitted quiz answers securely against backend correctIndex.
   */
  static async submitAttempt(userId, quizId, answers = [], questId = null, timeTaken = 0) {
    // Explicitly query +questions.correctIndex for server-side evaluation only
    const quiz = await Quiz.findById(quizId).select('+questions.correctIndex');
    if (!quiz) {
      throw new AppError('Quiz not found', 404);
    }

    // Check attempt limits
    const existingAttempts = await QuizAttempt.countDocuments({ userId, quizId });
    if (quiz.maxAttempts && quiz.maxAttempts > 0 && existingAttempts >= quiz.maxAttempts) {
      throw new AppError(`Maximum attempt limit (${quiz.maxAttempts}) reached for this quiz.`, 400);
    }

    let correctCount = 0;
    const totalQuestions = quiz.questions.length;
    const explanations = [];

    quiz.questions.forEach((q, index) => {
      const selectedOption = answers[index] !== undefined ? answers[index] : null;
      const isCorrect = selectedOption === q.correctIndex;
      if (isCorrect) correctCount++;

      explanations.push({
        questionId: q._id,
        text: q.text,
        options: q.options,
        selectedOption,
        correctOption: q.correctIndex,
        isCorrect,
        explanation: q.explanation,
      });
    });

    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= (quiz.passingScore || 70);

    let xpEarned = 0;
    let coinsEarned = 0;
    let xpAwarded = false;

    // Check if user has already passed this quiz before
    const priorPassed = await QuizAttempt.findOne({ userId, quizId, passed: true });

    if (passed && !priorPassed) {
      const xpReward = quiz.xpReward || 100;
      const coinReward = quiz.coinReward || 25;

      const xpRes = await XPService.award(
        userId,
        xpReward,
        'quiz',
        quiz._id,
        'Quiz',
        `Passed Knowledge Trial: ${quiz.title} (${score}%)`
      );

      const coinRes = await CoinService.award(
        userId,
        coinReward,
        'quiz',
        quiz._id,
        `Passed Knowledge Trial: ${quiz.title}`
      );

      xpEarned = xpRes?.awarded || 0;
      coinsEarned = coinRes?.awarded || 0;
      xpAwarded = xpEarned > 0;
    }

    const attempt = await QuizAttempt.create({
      userId,
      quizId,
      questId,
      answers,
      score,
      passed,
      attemptNumber: existingAttempts + 1,
      timeTaken: Math.max(0, parseInt(timeTaken, 10) || 0),
      xpEarned,
      coinsEarned,
      xpAwarded,
      completedAt: new Date(),
    });

    if (passed) {
      await ActivityService.log(userId, {
        type: 'quiz_passed',
        title: `Passed Knowledge Trial: ${quiz.title} (${score}%)`,
        referenceId: quiz._id,
        referenceModel: 'Quiz',
        metadata: { score, totalQuestions, xpEarned, coinsEarned },
      });

      // Evaluate achievements (e.g. quiz_count milestone)
      await AchievementService.evaluate(userId);
    }

    return {
      attemptId: attempt._id,
      score,
      passed,
      passingScore: quiz.passingScore || 70,
      correctCount,
      totalQuestions,
      attemptNumber: attempt.attemptNumber,
      timeTaken: attempt.timeTaken,
      xpEarned,
      coinsEarned,
      isFirstPass: passed && !priorPassed,
      explanations,
    };
  }
}

